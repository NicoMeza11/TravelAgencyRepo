package com.travelagency.backend.Controller.dto;

public interface SalesReportProjection {
    java.time.LocalDate getOperationDate();
    String getClientName();
    String getPackageName();
    Integer getPassengerCount();
    Double getTotalAmount();
    String getStatus();
}
