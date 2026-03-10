package com.kidsbank.api.security;

import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserRepository;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Argument resolver for @CurrentUser annotation.
 * Automatically injects the current authenticated user into controller methods.
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserRepository userRepository;

    public CurrentUserArgumentResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class) && 
               parameter.getParameterType().equals(User.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, 
                                ModelAndViewContainer mavContainer,
                                NativeWebRequest webRequest, 
                                WebDataBinderFactory binderFactory) throws Exception {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // The JWT filter stores userId as the principal, not username
        String userIdStr = authentication.getName();
        try {
            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId).orElse(null);
        } catch (NumberFormatException e) {
            // Fallback to username lookup if parsing fails
            return userRepository.findByUsername(userIdStr).orElse(null);
        }
    }
}