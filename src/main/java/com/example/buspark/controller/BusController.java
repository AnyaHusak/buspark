package com.example.buspark.controller;

import com.example.buspark.model.Bus;
import com.example.buspark.repository.BusRepository;
import com.example.buspark.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
@CrossOrigin(origins = "*") // дозволяє фронтенду звертатись до API
public class BusController {

    private final BusRepository busRepository;

    public BusController(BusRepository busRepository) {
        this.busRepository = busRepository;
    }

    @GetMapping(value = "/all", produces = "application/json; charset=UTF-8")
    public List<Bus> getAll() {
        return busRepository.findAll();
    }

    @Autowired
    private BusService busService;

    @PostMapping("/add")
    public void addBus(@RequestBody Bus bus) {
        busService.addBus(bus);
    }

    @PostMapping("/depart/{number}")
    public boolean departBus(@PathVariable int number) {
        return busService.sendBusToRoute(number);
    }

    @PostMapping("/return/{number}")
    public boolean returnBus(@PathVariable int number) {
        return busService.returnBusToPark(number);
    }

    @GetMapping("/in-park")
    public List<Bus> getInPark() {
        return busService.getInPark();
    }

    @GetMapping("/on-route")
    public List<Bus> getOnRoute() {
        return busService.getOnRoute();
    }

    @PutMapping("/update/{number}")
    public void updateBus(@PathVariable int number, @RequestBody Bus updatedBus) {
        busService.updateBus(number, updatedBus);
    }

    @DeleteMapping("/delete/{number}")
    public void deleteBus(@PathVariable int number) {
        busService.deleteBus(number);
    }

}
