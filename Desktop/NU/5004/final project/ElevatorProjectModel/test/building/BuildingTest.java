package building;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import enums.ElevatorSystemStatus;
import org.junit.Before;
import org.junit.Test;
import scanerzus.Request;

/**
 * Unit tests for the Building class.
 */
public class BuildingTest {
  private Building testBuilding1;
  private Building testBuilding2;

  @Before
  public void setUp() {
    testBuilding1 = new Building(3, 1, 3);
    testBuilding2 = new Building(10, 2, 5);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the number of floors is less than 1.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorLessThanOneFloor() {
    new Building(0, 2, 5);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the number of floors is greater than 30.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorGreaterThanThirtyFloors() {
    new Building(31, 2, 5);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the number of elevators is less than 1.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorLessThanOneElevator() {
    new Building(10, 0, 5);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the number of elevators is greater than 10.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorGreaterThanTenElevators() {
    new Building(10, 11, 5);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the elevator capacity is less than 3.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorLessThanThreeElevatorCapacity() {
    new Building(10, 2, 2);
  }

  /**
   * Test the constructor to throw an IllegalArgumentException
   * when the elevator capacity is greater than 20.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testConstructorGreaterThanTwentyElevatorCapacity() {
    new Building(10, 2, 21);
  }

  /**
   * Test the startElevatorSystem method when the system is running
   * with one elevator.
   */
  @Test
  public void testStartElevatorSystemRunningOneElevator() {
    testBuilding1.startElevatorSystem();
    assertTrue(
        testBuilding1.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
  }

  /**
   * Test the startElevatorSystem method when the system is stopping
   * with one elevator.
   */
  @Test
  public void testStartElevatorSystemStoppingOneElevator() {
    testBuilding1.stopElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.startElevatorSystem();
    assertTrue(
        testBuilding1.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
  }

  /**
   * Test the startElevatorSystem method when the system is running
   * with two elevators.
   */
  @Test
  public void testStartElevatorSystemRunningTwoElevators() {
    testBuilding2.startElevatorSystem();
    assertTrue(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
    assertTrue(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[1].isTakingRequests());
  }

  /**
   * Test the startElevatorSystem method when the system is stopping
   * with two elevators.
   */
  @Test
  public void testStartElevatorSystemStoppingTwoElevators() {
    testBuilding2.stopElevatorSystem();
    testBuilding2.stepElevatorSystem();
    testBuilding2.startElevatorSystem();
    assertTrue(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
    assertTrue(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[1].isTakingRequests());
  }

  /**
   * Test the startElevatorSystem method when the system is stopping.
   */
  @Test(expected = IllegalStateException.class)
  public void testStartElevatorSystemStopping() {
    testBuilding1.startElevatorSystem();
    testBuilding1.stopElevatorSystem();
    testBuilding1.startElevatorSystem();
  }


  /**
   * Test the stopElevatorSystem method when the system is running
   * with one elevator.
   */
  @Test
  public void testStopElevatorSystemRunningOneElevator() {
    testBuilding1.startElevatorSystem();
    testBuilding1.stopElevatorSystem();
    assertFalse(
        testBuilding1.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
  }

  /**
   * Test the stopElevatorSystem method when the system is stopping
   * with one elevator.
   */
  @Test
  public void testStopElevatorSystemStoppingOneElevator() {
    testBuilding1.startElevatorSystem();
    testBuilding1.stopElevatorSystem();
    assertFalse(
        testBuilding1.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
  }

  /**
   * Test the stopElevatorSystem method when the system is running
   * with two elevators.
   */
  @Test
  public void testStopElevatorSystemRunningTwoElevators() {
    testBuilding2.startElevatorSystem();
    testBuilding2.stopElevatorSystem();
    assertFalse(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
    assertFalse(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[1].isTakingRequests());
  }

  /**
   * Test the stopElevatorSystem method when the system is stopping
   * with two elevators.
   */
  @Test
  public void testStopElevatorSystemStoppingTwoElevators() {
    testBuilding2.startElevatorSystem();
    testBuilding2.stopElevatorSystem();
    assertFalse(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[0].isTakingRequests());
    assertFalse(
        testBuilding2.getBuildingSystemStatus().getElevatorReports()[1].isTakingRequests());
  }

  /**
   * Test the addElevatorRequest method with one up request
   * for one elevator.
   */
  @Test
  public void testAddElevatorRequestUpOneElevator() {
    Request request = new Request(0, 1);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
    assertEquals(
        1, testBuilding1.getBuildingSystemStatus().getUpRequests().size());
  }

  /**
   * Test the addElevatorRequest method with one down request
   * for one elevator.
   */
  @Test
  public void testAddElevatorRequestDownOneElevator() {
    Request request = new Request(1, 0);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
    assertEquals(
        1, testBuilding1.getBuildingSystemStatus().getDownRequests().size());
  }

  /**
   * Test the addElevatorRequest method with two up request
   * for two elevators.
   */
  @Test
  public void testAddElevatorRequestTwoUpTwoElevators() {
    Request request1 = new Request(0, 1);
    Request request2 = new Request(0, 2);
    testBuilding2.startElevatorSystem();
    testBuilding2.addElevatorRequest(request1);
    testBuilding2.addElevatorRequest(request2);
    assertEquals(
        2, testBuilding2.getBuildingSystemStatus().getUpRequests().size());
  }

  /**
   * Test the addElevatorRequest method with two down request
   * for two elevators.
   */
  @Test
  public void testAddElevatorRequestTwoDownTwoElevators() {
    Request request1 = new Request(1, 0);
    Request request2 = new Request(2, 0);
    testBuilding2.startElevatorSystem();
    testBuilding2.addElevatorRequest(request1);
    testBuilding2.addElevatorRequest(request2);
    assertEquals(
        2, testBuilding2.getBuildingSystemStatus().getDownRequests().size());
  }

  /**
   * Test the addElevatorRequest method with a null request.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testAddElevatorRequestNullRequest() {
    testBuilding1.addElevatorRequest(null);
  }

  /**
   * Test the addElevatorRequest method with an invalid request
   * that is out of top bounds.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testAddElevatorRequestInvalidRequestOutOfTopBounds() {
    Request request = new Request(0, 20);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
  }

  /**
   * Test the addElevatorRequest method with an invalid request
   * that is out of bottom bounds.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testAddElevatorRequestInvalidRequestOutOfBottomBounds() {
    Request request = new Request(20, -1);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
  }

  /**
   * Test the addElevatorRequests method when the system is not running.
   */
  @Test(expected = IllegalStateException.class)
  public void testAddElevatorRequestsSystemNotRunning() {
    testBuilding1.stopElevatorSystem();
    testBuilding1.addElevatorRequest(new Request(0, 1));
  }

  /**
   * Test the addElevatorRequests method when the from and to
   * floors are the same.
   */
  @Test(expected = IllegalArgumentException.class)
  public void testAddElevatorRequestsSameFloors() {
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(new Request(0, 0));
  }

  /**
   * Test the processElevatorRequests method when the system is running
   * with one elevator and one up request.
   */
  @Test
  public void testProcessElevatorRequestsRunningOneElevatorOneUpReq() {
    Request request = new Request(0, 1);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
    testBuilding1.processElevatorRequests();
    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getUpRequests().size());
  }

  /**
   * Test the processElevatorRequests method when the system is running
   * with one elevator and one down request.
   *
   * Also tested for the stepElevatorSystem method.
   */
  @Test
  public void testProcessElevatorRequestsRunningOneElevatorOneDownReq() {
    Request request = new Request(1, 0);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request);
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.processElevatorRequests();
    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getDownRequests().size());
  }

  /**
   * Test the processElevatorRequests method when the system is running
   * with one elevator and one up request and one down request.
   *
   * Also tested for the stepElevatorSystem method.
   */
  @Test
  public void testProcessElevatorRequestsRunningOneElevatorOneUpOneDownReq() {
    Request request1 = new Request(0, 1);
    Request request2 = new Request(1, 0);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request1);
    testBuilding1.addElevatorRequest(request2);
    testBuilding1.processElevatorRequests();
    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getUpRequests().size());
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();
    testBuilding1.stepElevatorSystem();

    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getDownRequests().size());
  }

  /**
   * Test the processElevatorRequests method that will
   * never allocate more requests than the elevator capacity.
   */
  @Test
  public void testProcessElevatorRequestsElevatorCapacity() {
    Request request1 = new Request(0, 1);
    Request request2 = new Request(0, 2);
    Request request3 = new Request(0, 1);
    Request request4 = new Request(0, 2);
    Request request5 = new Request(0, 1);
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(request1);
    testBuilding1.addElevatorRequest(request2);
    testBuilding1.addElevatorRequest(request3);
    testBuilding1.addElevatorRequest(request4);
    testBuilding1.addElevatorRequest(request5);
    testBuilding1.processElevatorRequests();
    // Since there is one elevator with a capacity of 3, the remaining requests
    // will be stored in the request queue.
    assertEquals(
        2, testBuilding1.getBuildingSystemStatus().getUpRequests().size());
  }

  /**
   * Test the stepElevatorSystem method when the system is stopping
   * and all elevators are on the ground floor.
   */
  @Test
  public void testStepElevatorSystemStopping() {
    testBuilding1.startElevatorSystem();
    testBuilding1.stopElevatorSystem();
    testBuilding1.stepElevatorSystem();
    assertEquals(
        ElevatorSystemStatus.OUT_OF_SERVICE,
        testBuilding1.getBuildingSystemStatus().getSystemStatus());
  }

  /**
   * Test the stepElevatorSystem method when the system is stopping
   * and at least one elevator is not on the ground floor.
   */
  @Test
  public void testStepElevatorSystemStoppingNotAllOnGroundFloor() {
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(new Request(0, 1));
    testBuilding1.stepElevatorSystem();
    testBuilding1.stopElevatorSystem();
    assertEquals(
        ElevatorSystemStatus.STOPPING,
        testBuilding1.getBuildingSystemStatus().getSystemStatus());
  }

  /**
   * Test the getNumberOfFloors method.
   */
  @Test
  public void testGetNumberOfFloors() {
    assertEquals(3, testBuilding1.getNumberOfFloors());
  }

  /**
   * Test the getNumberOfElevators method.
   */
  @Test
  public void testGetNumberOfElevators() {
    assertEquals(1, testBuilding1.getNumberOfElevators());
  }

  /**
   * Test the getElevatorCapacity method.
   */
  @Test
  public void testGetElevatorCapacity() {
    assertEquals(3, testBuilding1.getElevatorCapacity());
  }

  /**
   * Test the stopElevatorSystem method when one elevator
   * has a door open and eventually stop.
   *
   * Also tested for the stepElevatorSystem method
   * and check if all requests have been removed.
   */
  @Test
  public void testStopElevatorSystemDoorOpen() {
    testBuilding1.startElevatorSystem();
    testBuilding1.addElevatorRequest(new Request(0, 1));
    testBuilding1.stepElevatorSystem();
    testBuilding1.stopElevatorSystem();
    assertEquals(
        ElevatorSystemStatus.STOPPING,
        testBuilding1.getBuildingSystemStatus().getSystemStatus());

    testBuilding1.stepElevatorSystem();
    assertEquals(
        ElevatorSystemStatus.OUT_OF_SERVICE,
        testBuilding1.getBuildingSystemStatus().getSystemStatus());
    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getUpRequests().size());
    assertEquals(
        0, testBuilding1.getBuildingSystemStatus().getDownRequests().size());
  }

}
