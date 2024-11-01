package building;

import enums.ElevatorSystemStatus;
import elevator.ElevatorReport;
import java.util.List;
import scanerzus.Request;

/**
 * This is the reporting class for the building.
 */
public class BuildingReport {
  int numFloors;
  int numElevators;

  int elevatorCapacity;

  ElevatorReport[] elevatorReports;

  List<Request> upRequests;

  List<Request> downRequests;

  ElevatorSystemStatus systemStatus;

  /**
   * This constructor is used to create a new BuildingReport object.
   *
   * @param numFloors        The number of floors in the building.
   * @param numElevators     The number of elevators in the building.
   * @param elevatorCapacity The capacity of the elevators.
   * @param elevatorsReports The status of the elevators.
   * @param upRequests       The up requests for the elevators.
   * @param downRequests     The down requests for the elevators.
   * @param systemStatus     The status of the elevator system.
   */
  public BuildingReport(int numFloors,
                        int numElevators,
                        int elevatorCapacity,
                        ElevatorReport[] elevatorsReports,
                        List<Request> upRequests,
                        List<Request> downRequests,
                        ElevatorSystemStatus systemStatus) {
    this.numFloors = numFloors;
    this.numElevators = numElevators;
    this.elevatorCapacity = elevatorCapacity;
    this.elevatorReports = elevatorsReports;
    this.upRequests = upRequests;
    this.downRequests = downRequests;
    this.systemStatus = systemStatus;
  }

  /**
   * This method is used to get the number of floors in the building.
   *
   * @return the number of floors in the building
   */
  public int getNumFloors() {
    return this.numFloors;
  }

  /**
   * This method is used to get the number of elevators in the building.
   *
   * @return the number of elevators in the building
   */
  public int getNumElevators() {
    return this.numElevators;
  }

  /**
   * This method is used to get the max occupancy of the elevator.
   *
   * @return the max occupancy of the elevator.
   */
  public int getElevatorCapacity() {
    return this.elevatorCapacity;
  }

  /**
   * This method is used to get the status of the elevators.
   *
   * @return the status of the elevators.
   */
  public ElevatorReport[] getElevatorReports() {
    return this.elevatorReports;
  }

  /**
   * This method is used to get the up requests for the elevators.
   *
   * @return the requests for the elevators.
   */
  public List<Request> getUpRequests() {
    return this.upRequests;
  }

  /**
   * This method is used to get the down requests for the elevators.
   *
   * @return the requests for the elevators.
   */
  public List<Request> getDownRequests() {
    return this.downRequests;
  }


  /**
   * This method is used to get the status of the elevator system.
   *
   * @return the status of the elevator system.
   */
  public ElevatorSystemStatus getSystemStatus() {
    return this.systemStatus;
  }

  /**
   * Print the building report to the console.
   *
   * @return the building report as a string
   */
  public String toString() {
    StringBuilder report = new StringBuilder();

    report.append("Building Report:\n");
    report.append("Number of Floors: ").append(getNumFloors()).append("\n");
    report.append("Number of Elevators: ").append(getNumElevators()).append("\n");
    report.append("Elevator Capacity: ").append(getElevatorCapacity()).append("\n");

    // add Elevator Reports
    report.append("\nElevator Reports:\n");
    for (int i = 0; i < elevatorReports.length; i++) {
      report.append("Elevator ").append(i + 1).append(" Report:\n");
      report.append("  - Status: ").append(
          elevatorReports[i].isTakingRequests()).append("\n");
      report.append("  - Current Floor: ").append(
          elevatorReports[i].getCurrentFloor()).append("\n");
      report.append("  - Door Open Timer: ").append(
          elevatorReports[i].getDoorOpenTimer()).append("\n");
      report.append("  - End Wait Timer: ").append(
          elevatorReports[i].getEndWaitTimer()).append("\n");
    }

    // add Up Requests
    report.append("\nUp Requests:\n");
    for (Request request : upRequests) {
      report.append("  - ").append(request).append("\n");
    }

    // add Down Requests
    report.append("\nDown Requests:\n");
    for (Request request : downRequests) {
      report.append("  - ").append(request).append("\n");
    }

    // add System Status
    report.append("\nSystem Status: ").append(getSystemStatus()).append("\n");

    return report.toString();
  }

}
