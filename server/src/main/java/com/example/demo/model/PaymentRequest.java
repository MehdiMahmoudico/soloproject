package com.example.demo.model;

public class PaymentRequest {

    private double amount;
    private String currency;
    private String receiverWalletId;
    private String description;
    private int lifespan;  // The lifespan of the payment request, in minutes or seconds depending on API
    private String successUrl;  // URL to redirect on successful payment
    private boolean silentWebhook; // New field for silentWebhook
    private String failUrl;
    // Default constructor
    public PaymentRequest() {}

    // Constructor with all fields including silentWebhook
    public PaymentRequest(double amount, String currency, String receiverWalletId, String description, int lifespan, String successUrl,String failUrl, boolean silentWebhook) {
        this.amount = amount;
        this.currency = currency;
        this.receiverWalletId = receiverWalletId;
        this.description = description;
        this.lifespan = lifespan;
        this.successUrl = successUrl;
        this.failUrl = failUrl;
        this.silentWebhook = silentWebhook; // Set the value of silentWebhook
    }

    // Getters and Setters

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getReceiverWalletId() {
        return receiverWalletId;
    }

    public void setReceiverWalletId(String receiverWalletId) {
        this.receiverWalletId = receiverWalletId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getLifespan() {
        return lifespan;
    }

    public void setLifespan(int lifespan) {
        this.lifespan = lifespan;
    }

    public String getSuccessUrl() {
        return successUrl;
    }

    public void setSuccessUrl(String successUrl) {
        this.successUrl = successUrl;
    }

    public boolean isSilentWebhook() {
        return silentWebhook;
    }

    public void setSilentWebhook(boolean silentWebhook) {
        this.silentWebhook = silentWebhook;
    }

    public String getFailUrl() {
		return failUrl;
	}

	public void setFailUrl(String failUrl) {
		this.failUrl = failUrl;
	}

	// toString method to represent the PaymentRequest as a string
    @Override
    public String toString() {
        return "PaymentRequest{" +
                "amount=" + amount +
                ", currency='" + currency + '\'' +
                ", receiverWalletId='" + receiverWalletId + '\'' +
                ", description='" + description + '\'' +
                ", lifespan=" + lifespan +
                ", successUrl='" + successUrl + '\'' +
                ", silentWebhook=" + silentWebhook + // Include silentWebhook in the string representation
                ", failUrl='" + failUrl + '\'' +
                '}';
    }
}
