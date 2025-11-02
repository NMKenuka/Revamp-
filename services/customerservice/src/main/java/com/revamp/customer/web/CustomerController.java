package com.revamp.customer.web;

import com.revamp.customer.model.Customer;
import com.revamp.customer.repo.CustomerRepo;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {
  private final CustomerRepo customers;

  private String userId(Authentication auth) {
    return (auth != null && auth.getPrincipal() != null) ? String.valueOf(auth.getPrincipal()) : null;
  }

  @GetMapping("/me")
  public ResponseEntity<Customer> me(Authentication auth) {
    String uid = userId(auth);
    return customers.findByUserId(uid)
      .map(ResponseEntity::ok)
      .orElse(ResponseEntity.notFound().build());
  }

  @PutMapping("/me")
  public Customer updateMe(Authentication auth, @RequestBody @Valid Customer body) {
    String uid = userId(auth);
    Customer c = customers.findByUserId(uid)
      .orElse(new Customer(null, uid, null, body.getEmail(), null));
    if (body.getName()!=null)  c.setName(body.getName());
    if (body.getPhone()!=null) c.setPhone(body.getPhone());
    if (body.getEmail()!=null) c.setEmail(body.getEmail());
    return customers.save(c);
  }
}
