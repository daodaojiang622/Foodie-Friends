package enums;

/**
 * This enum is used to represent the status of the elevators.
 */
public enum ElevatorSystemStatus {
  RUNNING("Running"),
  STOPPING("Stopping"),
  OUT_OF_SERVICE("Out Of Service");
  final String display;

  ElevatorSystemStatus(String display) {
    this.display = display;
  }

  @Override
  public String toString() {
    return this.display;
  }
}
