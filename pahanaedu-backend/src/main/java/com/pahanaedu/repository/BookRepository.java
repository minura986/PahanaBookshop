package com.pahanaedu.repository;

import com.pahanaedu.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {

    /**
     * Finds all books with a given active status, returned in a paginated format.
     * Spring Data JPA creates the query automatically from the method name.
     *
     * @param active   The active status to filter by.
     * @param pageable Pagination information (page number, size, etc.).
     * @return A page of books matching the criteria.
     */
    Page<Book> findByActive(boolean active, Pageable pageable);
}