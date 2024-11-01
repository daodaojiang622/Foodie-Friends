package main;

import building.Building;
import building.BuildingReport;
import java.util.Scanner;
import scanerzus.Request;

/**
 * The driver for the elevator system.
 * This class will create the elevator system with one elevator and run it.
 * this is for testing the elevator system.
 * <p>
 * It provides a user interface to the elevator system.
 */
public class MainOneElevator {

  /**
   * The main method for the elevator system.
   * This method creates the elevator system with one elevator and runs it.
   *
   * @param args the command line arguments
   */
  public static void main(String[] args) {

    // the number of floors, the number of elevators, and the number of people.
    final int numFloors = 11;
    final int numElevators = 1;
    final int numPeople = 3;

    // Display the introduction text
    String[] introText = {
        "Welcome to the Elevator System!",
        "This system will simulate the operation of an elevator system.",
        "The system will be initialized with the following parameters:",
        "Number of floors: " + numFloors,
        "Number of elevators: " + numElevators,
        "Number of people: " + numPeople,
        "The system will then be run and the results will be displayed."
    };

    // User can issue commands to the building (requests, step, start, stop)
    String[] commandTest = {
        "[s] Run step one time",
        "[r start end] make a request",
        "[start] start building",
        "[stop] stop building",
        "[q] quit building",
        "",
        "Your command > "
    };

    for (String line : introText) {
      System.out.println(line);
    }

    // Create the building and the report
    Building building = new Building(numFloors, numElevators, numPeople);

    BuildingReport report = building.getBuildingSystemStatus();
    // print the building report
    printBuildingReport(report);

    System.out.println("Press Enter to continue...");
    // Wait for user input to start the system
    Scanner scanner = new Scanner(System.in);
    scanner.nextLine();

    // Run the system
    boolean running = true;
    while (running) {
      for (String line : commandTest) {
        System.out.println(line);
      }
      String command = scanner.nextLine();
      String[] parts = command.split(" ");

      switch (parts[0]) {
        case "s":
          building.stepElevatorSystem();
          BuildingReport stepReport = building.getBuildingSystemStatus();
          printBuildingReport(stepReport);
          break;
        case "r":
          if (parts.length < 3) {
            System.out.println("Please provide start and end floors.");
            break;
          }
          int start = Integer.parseInt(parts[1]);
          int end = Integer.parseInt(parts[2]);
          building.addElevatorRequest(new Request(start, end));

          BuildingReport requestReport = building.getBuildingSystemStatus();
          printBuildingReport(requestReport);
          break;
        case "start":
          building.startElevatorSystem();
          BuildingReport startReport = building.getBuildingSystemStatus();
          printBuildingReport(startReport);
          break;
        case "stop":
          building.stopElevatorSystem();
          BuildingReport stopReport = building.getBuildingSystemStatus();
          printBuildingReport(stopReport);
          break;
        case "q":
          running = false;
          break;
        default:
          System.out.println("Invalid command.");
          break;
      }
    }

    scanner.close();
  }

  /**
   * Print the building report.
   *
   * @param report the building report to print
   */
  private static void printBuildingReport(BuildingReport report) {
    System.out.println("------------Building Report------------");
    System.out.println(report.toString());
    System.out.println("---------------End Report--------------\n");
  }
}