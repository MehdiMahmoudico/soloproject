package com.example.demo.validation;

import com.example.demo.model.User;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, User> {

    @Override
    public void initialize(PasswordMatches constraint) {}

    @Override
    public boolean isValid(User user, ConstraintValidatorContext context) {
        if (user == null) {
            return true; 
        }
        return user.getPassword().equals(user.getPasswordConfirmation());
    }
}
