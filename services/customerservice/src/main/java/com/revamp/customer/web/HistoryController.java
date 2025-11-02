package com.revamp.customer.web;

import com.revamp.customer.model.HistoryItem;
import com.revamp.customer.repo.HistoryRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryRepo historyRepo;

    private String userId(Authentication auth, HttpServletRequest req) {
        String uid = req.getHeader("X-User-Id");
        if (uid != null && !uid.isBlank()) return uid;
        return (auth != null && auth.getPrincipal() != null) ? String.valueOf(auth.getPrincipal()) : null;
    }

    @GetMapping
    public List<HistoryItem> history(Authentication auth, HttpServletRequest req) {
        String uid = userId(auth, req);
        return historyRepo.findByCustomerUserIdOrderByCompletedAtDesc(uid);
    }

    @PostMapping
    public HistoryItem add(Authentication auth, HttpServletRequest req, @RequestBody @Valid HistoryItem item) {
        String uid = userId(auth, req);
        item.setId(null);
        item.setCustomerUserId(uid);
        return historyRepo.save(item);
    }
}
