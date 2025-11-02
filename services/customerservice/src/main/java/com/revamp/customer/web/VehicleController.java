package com.revamp.customer.web;

import com.revamp.customer.model.Vehicle;
import com.revamp.customer.repo.VehicleRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleRepo vehicles;

    private String userId(Authentication auth, HttpServletRequest req) {
        String uid = req.getHeader("X-User-Id");
        if (uid != null && !uid.isBlank()) return uid;
        return (auth != null && auth.getPrincipal() != null) ? String.valueOf(auth.getPrincipal()) : null;
    }

    @GetMapping
    public List<Vehicle> list(Authentication auth, HttpServletRequest req) {
        String uid = userId(auth, req);
        return vehicles.findByCustomerUserId(uid);
    }

    @PostMapping
    public Vehicle create(Authentication auth, HttpServletRequest req, @RequestBody @Valid Vehicle v) {
        String uid = userId(auth, req);
        v.setId(null);
        v.setCustomerUserId(uid);
        return vehicles.save(v);
    }

    @PutMapping("/{id}")
    public Vehicle update(Authentication auth, HttpServletRequest req, @PathVariable String id, @RequestBody @Valid Vehicle v) {
        String uid = userId(auth, req);
        v.setId(id);
        v.setCustomerUserId(uid); // keep ownership consistent
        return vehicles.save(v);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        vehicles.deleteById(id);
    }
}
