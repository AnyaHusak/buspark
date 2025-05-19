package com.example.buspark.service;

import com.example.buspark.model.Bus;
import com.example.buspark.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    public void addBus(Bus bus) {
        if (busRepository.existsById(bus.getNumber())) {
            throw new IllegalArgumentException("Автобус з таким номером вже існує");
        }
        bus.setOnRoute(false);
        busRepository.save(bus);
    }


    public boolean sendBusToRoute(int number) {
        Optional<Bus> busOpt = busRepository.findById(number);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            if (!bus.isOnRoute()) {
                bus.setOnRoute(true);
                busRepository.save(bus);
                return true;
            }
        }
        return false;
    }

    public boolean returnBusToPark(int number) {
        Optional<Bus> busOpt = busRepository.findById(number);
        if (busOpt.isPresent()) {
            Bus bus = busOpt.get();
            if (bus.isOnRoute()) {
                bus.setOnRoute(false);
                busRepository.save(bus);
                return true;
            }
        }
        return false;
    }

    public List<Bus> getInPark() {
        return busRepository.findByOnRoute(false);
    }

    public List<Bus> getOnRoute() {
        return busRepository.findByOnRoute(true);
    }
    public void updateBus(int number, Bus updatedBus) {
        Bus bus = busRepository.findById(number).orElseThrow();
        bus.setDriver(updatedBus.getDriver());
        bus.setRoute(updatedBus.getRoute());
        bus.setOnRoute(updatedBus.isOnRoute());
        busRepository.save(bus);
    }

    public void deleteBus(int number) {
        busRepository.deleteById(number);
    }

}
