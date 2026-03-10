package com.kidsbank.api.task;

import com.kidsbank.api.bank.Account;
import com.kidsbank.api.bank.AccountRepository;
import com.kidsbank.api.bank.Transaction;
import com.kidsbank.api.bank.TransactionRepository;
import com.kidsbank.api.bank.TransactionType;
import com.kidsbank.api.common.BadRequestException;
import com.kidsbank.api.common.NotFoundException;
import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository,
                      AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public TaskItem createTask(Long parentId, Long childId, String title, String description, BigDecimal amount) {
        // Verify parent exists
        User parent = userRepository.findById(parentId)
            .orElseThrow(() -> new NotFoundException("Parent not found"));
        
        // Verify child exists
        User child = userRepository.findById(childId)
            .orElseThrow(() -> new NotFoundException("Child not found"));

        // Verify parent has sufficient balance
        Account parentAccount = accountRepository.findByUserId(parentId)
            .orElseThrow(() -> new NotFoundException("Parent account not found"));
        
        if (parentAccount.getBalance().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient balance to create task");
        }

        TaskItem task = new TaskItem();
        task.setParentId(parentId);
        task.setChildId(childId);
        task.setTitle(title);
        task.setDescription(description);
        task.setAmount(amount);
        task.setStatus(TaskStatus.PENDING);
        task.setCreatedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    public List<TaskItem> getParentTasks(Long parentId) {
        return taskRepository.findByParentIdOrderByCreatedAtDesc(parentId);
    }

    public List<TaskItem> getChildTasks(Long childId) {
        return taskRepository.findByChildIdOrderByCreatedAtDesc(childId);
    }

    @Transactional
    public TaskItem completeTask(Long taskId, Long childId, String photoUrl, String notes) {
        TaskItem task = taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!task.getChildId().equals(childId)) {
            throw new BadRequestException("Task does not belong to this child");
        }

        if (task.getStatus() != TaskStatus.PENDING && task.getStatus() != TaskStatus.REJECTED) {
            throw new BadRequestException("Task cannot be completed in current status");
        }

        task.setStatus(TaskStatus.COMPLETED);
        task.setPhotoUrl(photoUrl);
        task.setChildNotes(notes);
        task.setCompletedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Transactional
    public TaskItem approveTask(Long taskId, Long parentId, String parentNotes) {
        TaskItem task = taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!task.getParentId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to this parent");
        }

        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new BadRequestException("Task must be completed before approval");
        }

        // Get accounts
        Account parentAccount = accountRepository.findByUserId(parentId)
            .orElseThrow(() -> new NotFoundException("Parent account not found"));
        Account childAccount = accountRepository.findByUserId(task.getChildId())
            .orElseThrow(() -> new NotFoundException("Child account not found"));

        // Verify parent still has sufficient balance
        if (parentAccount.getBalance().compareTo(task.getAmount()) < 0) {
            throw new BadRequestException("Insufficient balance to approve task");
        }

        // Transfer money
        parentAccount.setBalance(parentAccount.getBalance().subtract(task.getAmount()));
        childAccount.setBalance(childAccount.getBalance().add(task.getAmount()));

        accountRepository.save(parentAccount);
        accountRepository.save(childAccount);

        // Create transactions
        Transaction parentTransaction = new Transaction();
        parentTransaction.setAccountId(parentAccount.getId());
        parentTransaction.setAmount(task.getAmount().negate());
        parentTransaction.setType(TransactionType.WITHDRAWAL);
        parentTransaction.setNote("Task payment: " + task.getTitle());
        parentTransaction.setCreatedAt(LocalDateTime.now());

        Transaction childTransaction = new Transaction();
        childTransaction.setAccountId(childAccount.getId());
        childTransaction.setAmount(task.getAmount());
        childTransaction.setType(TransactionType.DEPOSIT);
        childTransaction.setNote("Task reward: " + task.getTitle());
        childTransaction.setCreatedAt(LocalDateTime.now());

        transactionRepository.save(parentTransaction);
        transactionRepository.save(childTransaction);

        // Update task
        task.setStatus(TaskStatus.APPROVED);
        task.setParentNotes(parentNotes);
        task.setApprovedAt(LocalDateTime.now());

        return taskRepository.save(task);
    }

    @Transactional
    public TaskItem rejectTask(Long taskId, Long parentId, String parentNotes) {
        TaskItem task = taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!task.getParentId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to this parent");
        }

        if (task.getStatus() != TaskStatus.COMPLETED) {
            throw new BadRequestException("Task must be completed before rejection");
        }

        task.setStatus(TaskStatus.REJECTED);
        task.setParentNotes(parentNotes);

        return taskRepository.save(task);
    }

    public TaskItem getTask(Long taskId) {
        return taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));
    }

    @Transactional
    public void deleteTask(Long taskId, Long parentId) {
        TaskItem task = taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!task.getParentId().equals(parentId)) {
            throw new BadRequestException("Task does not belong to this parent");
        }

        if (task.getStatus() == TaskStatus.APPROVED) {
            throw new BadRequestException("Cannot delete approved task");
        }

        taskRepository.delete(task);
    }
}