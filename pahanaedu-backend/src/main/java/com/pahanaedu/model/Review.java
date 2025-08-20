// Pahana/pahanaedu-backend/src/main/java/com/pahanaedu/model/Review.java
package com.pahanaedu.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String bookId;
    private String userId;
    private String username;
    private int rating;
    private String comment;
    private Date date;

    public Review() {
        this.date = new Date();
    }

    public Review(String bookId, String userId, String username, int rating, String comment) {
        this.bookId = bookId;
        this.userId = userId;
        this.username = username;
        this.rating = rating;
        this.comment = comment;
        this.date = new Date();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}