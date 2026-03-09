@echo off
keytool -genkeypair -v -storetype PKCS12 -keystore app\stack-release-key.keystore -alias stack-key-alias -keyalg RSA -keysize 2048 -validity 10000 -storepass stackkidsbank2024 -keypass stackkidsbank2024 -dname "CN=STACK Kids Bank, OU=Development, O=STACK, L=Tashkent, ST=Tashkent, C=UZ"
echo Keystore created successfully!
pause
