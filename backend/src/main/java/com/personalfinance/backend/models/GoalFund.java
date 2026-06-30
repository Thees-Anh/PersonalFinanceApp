package com.personalfinance.backend.models;

import java.util.Date;

public class GoalFund {
    private double amount;
    private String note;
    private Date date;

    public GoalFund() {}

    public GoalFund(double amount, String note, Date date) {
        this.amount = amount;
        this.note = note;
        this.date = date;
    }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    
    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }
}
