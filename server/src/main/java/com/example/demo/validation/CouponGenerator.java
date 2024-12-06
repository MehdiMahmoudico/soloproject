package com.example.demo.validation;

import java.util.Random;

public class CouponGenerator {
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 8;

    // Method to generate a random coupon code
    public static String generateCouponCode() {
        Random random = new Random();
        StringBuilder couponCode = new StringBuilder(CODE_LENGTH);
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            couponCode.append(CHARACTERS.charAt(index));
        }
        
        return couponCode.toString();
    }
}

