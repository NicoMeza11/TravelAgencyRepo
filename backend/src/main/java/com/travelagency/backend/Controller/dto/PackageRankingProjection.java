package com.travelagency.backend.Controller.dto;

public interface PackageRankingProjection {
    String getPackageName();
    Long getReservationCount();
    Integer getTotalPassengers();
    Double getTotalAmountGenerated();
}
