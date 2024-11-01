package building;

import enums.ElevatorSystemStatus;
import elevator.Elevator;
import elevator.ElevatorInterface;
import elevator.ElevatorReport;
import java.util.ArrayList;
import java.util.List;
import scanerzus.Request;

/**
 * This class represents a building.
 */
public class Building implements BuildingInterface {

  private static final int BASE_ZERO_CONVERSION = 1;
  private final int numberOfFloors;
  private final int numberOfElevators;
  private final int elevatorCapacity;
  private List<Elevator> elevators;
  private ElevatorSystemStatus systemStatus;
  private List<Request> upRequests;
  private List<Request> downRequests;

  /**
   * The constructor for the building.
   *
   * @param numberOfFloors the number of floors in the building.
   * @param numberOfElevators the number of elevators in the building.
   * @param elevatorCapacity the capacity of the elevators in the building.
   *
   * @throws IllegalArgumentException if the number of floors is not between 1 and 30,
   *                                 the number of elevators is not between 1 and 10,
   *                                 or the elevator capacity is not between 3 and 20.
   */
  public Building(int numberOfFloors, int numberOfElevators, int elevatorCapacity) {
    if (numberOfFloors < 1
        || numberOfFloors > 30
        || numberOfElevators < 1
        || numberOfElevators >  10
        || elevatorCapacity < 3
        || elevatorCapacity > 20) {
      throw new IllegalArgumentException("Invalid parameters for building.");
    }

    this.numberOfFloors = numberOfFloors;
    this.numberOfElevators = numberOfElevators;
    this.elevatorCapacity = elevatorCapacity;
    this.elevators = new ArrayList<>();
    this.upRequests = new ArrayList<>();
    this.downRequests = new ArrayList<>();
    this.systemStatus = ElevatorSystemStatus.OUT_OF_SERVICE;

    // Create elevators
    for (int i = 0; i < numberOfElevators; i++) {
      Elevator elevator = new Elevator(numberOfFloors, elevatorCapacity);
      elevators.add(elevator);
    }
  }

  @Override
  public void addElevatorRequest(Request request) throws IllegalArgumentException {
    if (request == null) {
      throw new IllegalArgumentException("Request cannot be null.");
    }
    if (systemStatus != ElevatorSystemStatus.RUNNING) {
      throw new IllegalStateException("Building system is not running.");
    }
    if (request.getStartFloor() < 0
        || request.getStartFloor() > numberOfFloors - BASE_ZERO_CONVERSION
        || request.getEndFloor() < 0
        || request.getEndFloor() > numberOfFloors - BASE_ZERO_CONVERSION) {
      throw new IllegalArgumentException("Invalid request.");
    }

    if (request.getStartFloor() < request.getEndFloor()) {
      upRequests.add(request);
    } else if (request.getStartFloor() > request.getEndFloor()) {
      downRequests.add(request);
    } else {
      throw new IllegalArgumentException("Invalid request.");
    }
  }

  @Override
  public void processElevatorRequests() {
    for (Elevator elevator : elevators) {
      if (elevator.isTakingRequests()
          && elevator.getCurrentFloor() == 0) {
        elevator.processRequests(subRequests(upRequests));
      } else if (elevator.isTakingRequests()
          && elevator.getCurrentFloor() == numberOfFloors - BASE_ZERO_CONVERSION) {
        elevator.processRequests(subRequests(downRequests));
      }
    }
  }

  /**
   * Returns a sub-list of requests that can be processed by the elevator.
   *
   * @param requests the list of requests.
   * @return the sub-list of requests that can be processed by the elevator.
   */
  private List<Request> subRequests(List<Request> requests) {
    List<Request> returnList = new ArrayList<>();

    while (!requests.isEmpty() && returnList.size() < elevatorCapacity) {
      returnList.add(requests.remove(0));
    }
    return returnList;
  }

  @Override
  public void startElevatorSystem() {
    if (systemStatus != ElevatorSystemStatus.RUNNING) {
      if (systemStatus == ElevatorSystemStatus.STOPPING) {
        throw new IllegalStateException("Building system is stopping. Cannot start.");
      } else {
        // Start all elevators
        for (Elevator elevator : elevators) {
          elevator.start();
        }
        systemStatus = ElevatorSystemStatus.RUNNING;
      }
    }
  }

  @Override
  public void stopElevatorSystem() {
    if (systemStatus != ElevatorSystemStatus.OUT_OF_SERVICE
        && systemStatus != ElevatorSystemStatus.STOPPING) {
      // Stop all elevators
      for (ElevatorInterface elevator : elevators) {
        elevator.takeOutOfService();
        systemStatus = ElevatorSystemStatus.STOPPING;
        upRequests.clear();
        downRequests.clear();
      }
    }
  }

  @Override
  public void stepElevatorSystem() {
    if (systemStatus != ElevatorSystemStatus.OUT_OF_SERVICE) {
      if (systemStatus != ElevatorSystemStatus.STOPPING) {
        processElevatorRequests();
      }

      for (Elevator elevator : elevators) {
        elevator.step();
      }

      if (systemStatus == ElevatorSystemStatus.STOPPING) {
        boolean allElevatorsOnGroundFloor = true;
        for (Elevator elevator : elevators) {
          if (elevator.getCurrentFloor() != 0) {
            allElevatorsOnGroundFloor = false;
            break;
          }
        }

        if (allElevatorsOnGroundFloor) {
          systemStatus = ElevatorSystemStatus.OUT_OF_SERVICE;
        }
      }
    }
  }

  @Override
  public int getNumberOfFloors() {
    return numberOfFloors;
  }

  @Override
  public int getNumberOfElevators() {
    return numberOfElevators;
  }

  @Override
  public int getElevatorCapacity() {
    return elevatorCapacity;
  }

  @Override
  public BuildingReport getBuildingSystemStatus() {
    ElevatorReport[] elevatorReports = new ElevatorReport[elevators.size()];
    for (int i = 0; i < elevators.size(); i++) {
      elevatorReports[i] = elevators.get(i).getElevatorStatus();
    }

    return new BuildingReport(
        numberOfFloors,
        numberOfElevators,
        elevatorCapacity,
        elevatorReports,
        upRequests,
        downRequests,
        systemStatus);
  }
}