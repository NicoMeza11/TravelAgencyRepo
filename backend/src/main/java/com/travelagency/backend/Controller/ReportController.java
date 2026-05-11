package com.travelagency.backend.Controller;

import com.travelagency.backend.Controller.dto.PackageRankingProjection;
import com.travelagency.backend.Controller.dto.SalesReportProjection;
import com.travelagency.backend.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('admin_client_role')")
@CrossOrigin(origins={"http://localhost:5173", "http://localhost:8070","http://18.230.122.69:8070"})
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/sales")
    public ResponseEntity<List<SalesReportProjection>> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        return ResponseEntity.ok(reportService.getSalesReport(startDate, endDate));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<PackageRankingProjection>> getPackageRanking(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {

        return ResponseEntity.ok(reportService.getPackageRanking(startDate, endDate));
    }
}
