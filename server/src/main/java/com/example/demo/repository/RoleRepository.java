package com.example.demo.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Role;

@Repository
public interface RoleRepository extends CrudRepository<Role, Long> {
		List<Role> findByName(String name);
		List<Role> findAll();
}

