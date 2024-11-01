package building;

import static org.junit.Assert.assertEquals;

import elevator.ElevatorReport;
import org.junit.Before;
import org.junit.Test;
import scanerzus.Request;

/**
 * Test the BuildingReport class.
 */
public class BuildingReportTest {

  private building.Building testBuilding1;
  private building.Building testBuilding2;

  private building.BuildingReport testBuildingReport1;
  private building.BuildingReport testBuildingReport2;

  /**
   * Set up the test environment.
   */
  @Before
  public void setUp() {
    testBuilding1 = new building.Building(3, 1, 3);
    testBuilding2 = new building.Building(10, 2, 5);

    testBuildingReport1 = testBuilding1.getBuildingSystemStatus();
    testBuildingReport2 = testBuilding2.getBuildingSystemStatus();
  }

  /**
   * Test the constructor of the BuildingReport class.
   */
  @Test
  public void testBuildingReportConstructor() {
    building.BuildingReport buildingReport = new building.BuildingReport(
        10, 5, 10,
        new ElevatorReport[5], null,
        null, null);
    assert buildingReport.getNumFloors() == 10;
    assert buildingReport.getNumElevators() == 5;
    assert buildingReport.getElevatorCapacity() == 10;
    assert buildingReport.getElevatorReports().length == 5;
    assert buildingReport.getUpRequests() == null;
    assert buildingReport.getDownRequests() == null;
    assert buildingReport.getSystemStatus() == null;
  }

  /**
   * Test the getNumFloors method of the BuildingReport class.
   */
  @Test
  public void testGetNumFloors() {
    assert testBuildingReport1.getNumFloors() == 3;
    assert testBuildingReport2.getNumFloors() == 10;
  }

  /**
   * Test the getNumElevators method of the BuildingReport class.
   */
  @Test
  public void testGetNumElevators() {
    assert testBuildingReport1.getNumElevators() == 1;
    assert testBuildingReport2.getNumElevators() == 2;
  }

  /**
   * Test the getElevatorCapacity method of the BuildingReport class.
   */
  @Test
  public void testGetElevatorCapacity() {
    assert testBuildingReport1.getElevatorCapacity() == 3;
    assert testBuildingReport2.getElevatorCapacity() == 5;
  }

  /**
   * Test the getElevatorReports method of the BuildingReport class.
   */
  @Test
  public void testGetElevatorReports() {
    assert testBuildingReport1.getElevatorReports().length == 1;
    assert testBuildingReport2.getElevatorReports().length == 2;
  }

  /**
   * Test the getUpRequests method of the BuildingReport class.
   */
  @Test
  public void testGetUpRequests() {
    Request request1 = new Request(0, 1);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request1);

    assert testBuildingReport1.getUpRequests().size() == 1;
  }

  /**
   * Test the getDownRequests method of the BuildingReport class.
   */
  @Test
  public void testGetDownRequests() {
    Request request1 = new Request(1, 0);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request1);

    assert testBuildingReport1.getDownRequests().size() == 1;
  }

  /**
   * Test the toString method of the BuildingReport class
   * when there are one building with one elevator initialized.
   */
  @Test
  public void testToStringOneElevatorInitialized() {
    String expectedReport1 =
        "Building Report:\n"
        + "Number of Floors: 3\n"
        + "Number of Elevators: 1\n"
        + "Elevator Capacity: 3\n"
        + "\n"
        + "Elevator Reports:\n"
        + "Elevator 1 Report:\n"
        + "  - Status: true\n"
        + "  - Current Floor: 0\n"
        + "  - Door Open Timer: 0\n"
        + "  - End Wait Timer: 0\n"
        + "\n"
        + "Up Requests:\n"
        + "\n"
        + "Down Requests:\n"
        + "\n"
        + "System Status: Out Of Service"
        + "\n";
    System.out.println(testBuildingReport1.toString());
    assertEquals(expectedReport1, testBuildingReport1.toString());
  }

  /**
   * Test the toString method of the BuildingReport class
   * when there are two elevators initialized and started.
   */
  @Test
  public void testToStringTwoElevatorsInitializedAndStarted() {
    testBuilding2.startElevatorSystem();
    testBuilding2.addElevatorRequest(new Request(0, 1));
    testBuilding2.addElevatorRequest(new Request(1, 0));
    building.BuildingReport testBuildingReport2 = testBuilding2.getBuildingSystemStatus();

    String expectedReport2 =
        "Building Report:\n"
        + "Number of Floors: 10\n"
        + "Number of Elevators: 2\n"
        + "Elevator Capacity: 5\n"
        + "\n"
        + "Elevator Reports:\n"
        + "Elevator 1 Report:\n"
        + "  - Status: true\n"
        + "  - Current Floor: 0\n"
        + "  - Door Open Timer: 0\n"
        + "  - End Wait Timer: 5\n"
        + "Elevator 2 Report:\n"
        + "  - Status: true\n"
        + "  - Current Floor: 0\n"
        + "  - Door Open Timer: 0\n"
        + "  - End Wait Timer: 5\n"
        + "\n"
        + "Up Requests:\n"
        + "  - 0->1\n"
        + "\n"
        + "Down Requests:\n"
        + "  - 1->0\n"
        + "\n"
        + "System Status: Running"
        + "\n";
    assertEquals(expectedReport2, testBuildingReport2.toString());
  }

  /**
   * Test the toString method of the BuildingReport class
   * when there are two elevators initialized and started,
   * and stepped once.
   *
   * End wait timer should be decremented by 1
   * and door open timer should be 3.
   */
  @Test
  public void testToStringTwoElevatorsInitializedAndStartedAndStep() {
    testBuilding2.startElevatorSystem();
    testBuilding2.addElevatorRequest(new Request(0, 1));
    testBuilding2.addElevatorRequest(new Request(1, 0));
    testBuilding2.stepElevatorSystem();
    building.BuildingReport testBuildingReport2 = testBuilding2.getBuildingSystemStatus();

    String expectedReport2 =
        "Building Report:\n"
        + "Number of Floors: 10\n"
        + "Number of Elevators: 2\n"
        + "Elevator Capacity: 5\n"
        + "\n"
        + "Elevator Reports:\n"
        + "Elevator 1 Report:\n"
        + "  - Status: false\n"
        + "  - Current Floor: 0\n"
        + "  - Door Open Timer: 3\n"
        + "  - End Wait Timer: 0\n"
        + "Elevator 2 Report:\n"
        + "  - Status: true\n"
        + "  - Current Floor: 0\n"
        + "  - Door Open Timer: 0\n"
        + "  - End Wait Timer: 4\n"
        + "\n"
        + "Up Requests:\n"
        + "\n"
        + "Down Requests:\n"
        + "  - 1->0\n"
        + "\n"
        + "System Status: Running"
        + "\n";
    assertEquals(expectedReport2, testBuildingReport2.toString());
  }

  /**
   * Test the toString method of the BuildingReport class
   * when there are two elevators initialized and started,
   * and stepped twice.
   *
   * End wait timer should be decremented by 2
   * and door open timer should be 2.
   */
  @Test
  public void testToStringTwoElevatorsInitializedAndStartedAndStepTwice() {
    testBuilding2.startElevatorSystem();
    testBuilding2.addElevatorRequest(new Request(0, 1));
    testBuilding2.addElevatorRequest(new Request(1, 0));
    testBuilding2.stepElevatorSystem();
    testBuilding2.stepElevatorSystem();
    building.BuildingReport testBuildingReport2 = testBuilding2.getBuildingSystemStatus();

    String expectedReport2 =
        "Building Report:\n"
            + "Number of Floors: 10\n"
            + "Number of Elevators: 2\n"
            + "Elevator Capacity: 5\n"
            + "\n"
            + "Elevator Reports:\n"
            + "Elevator 1 Report:\n"
            + "  - Status: false\n"
            + "  - Current Floor: 0\n"
            + "  - Door Open Timer: 2\n"
            + "  - End Wait Timer: 0\n"
            + "Elevator 2 Report:\n"
            + "  - Status: true\n"
            + "  - Current Floor: 0\n"
            + "  - Door Open Timer: 0\n"
            + "  - End Wait Timer: 3\n"
            + "\n"
            + "Up Requests:\n"
            + "\n"
            + "Down Requests:\n"
            + "  - 1->0\n"
            + "\n"
            + "System Status: Running"
            + "\n";
    assertEquals(expectedReport2, testBuildingReport2.toString());
  }

}
