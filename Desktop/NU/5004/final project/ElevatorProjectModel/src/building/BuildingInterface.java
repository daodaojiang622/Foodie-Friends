package building;

import scanerzus.Request;

/**
 * This interface is used to represent a building.
 */
public interface BuildingInterface {

  /**
   * This method is used to add an elevator request to the up
   * or down request list depending on the direction of the request.
   *
   * @param request the request to add.
   */
  void addElevatorRequest(Request request) throws IllegalArgumentException;

  /**
   * This method is used to process elevator request up and down lists
   * in the order they are received.
   *
   */
  void processElevatorRequests();

  /**
   * This method is used to start the elevator system.
   */
  void startElevatorSystem();

  /**
   * This method is used to stop the elevator system,
   * and clear all requests from the elevators.
   */
  void stopElevatorSystem();

  /**
   * This method is used to step the elevator system.
   */
  void stepElevatorSystem();

  /**
   * To get the number of floors in the building.
   * @return the number of floors in the building.
   */
  int getNumberOfFloors();

  /**
   * To get the number of elevators in the building.
   * @return the number of elevators in the building.
   */
  int getNumberOfElevators();

  /**
   * To get the capacity of the elevators in the building.
   * @return the capacity of the elevators in the building.
   */
  int getElevatorCapacity();

  /**
   * This method is used to get the building report.
   *
   * @return the building report.
   */
  BuildingReport getBuildingSystemStatus();

}
