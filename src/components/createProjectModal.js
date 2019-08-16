import React, { Component } from "react";
import { Modal, Form, Button, Select } from "semantic-ui-react";

const TEST = 2 * 60;
const DAY = 1 * 24 * 60 * 60;
const WEEK = 7 * 24 * 60 * 60;
const MONTH = 30 * 24 * 60 * 60;

const initialState = {
  projectName: "",
  projectGoalInEth: 0,
  projectDeadline: DAY
};

class CreateProjectModal extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleClose = () => {
    this.props.onCloseModal();
    this.setState(initialState);
  };

  handleCreate = () => {
    this.props.onHandleProjectCreate(this.state);
    this.setState(initialState);
  };

  render() {
    const { isDisplayed, gasCost } = this.props;

    return (
      <div>
        <Modal
          open={isDisplayed}
          closeOnDocumentClick={true}
          onClose={this.handleClose}
        >
          <Modal.Header>Create a new crowdfunding project</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <Form>
                <Form.Input
                  label="Enter a name for the project"
                  placeholder="Name"
                  name={"projectName"}
                  onChange={this.handleChange}
                  value={this.state.projectName}
                />
                <Form.Input
                  label="Enter a goal in Ether"
                  placeholder="ex 100"
                  name={"projectGoalInEth"}
                  onChange={this.handleChange}
                  value={this.state.projectGoalInEth}
                />
                <Form.Field
                  control={Select}
                  label={"Select a deadline for funding"}
                  name={"projectDeadline"}
                  value={this.state.projectDeadline}
                  options={[
                    { key: "0", text: "1 Day (1*24*60*60)", value: DAY },
                    { key: "1", text: "1 Week (7*24*60*60)", value: WEEK },
                    { key: "2", text: "1 Month (30*24*60*60)", value: MONTH },
                    { key: "3", text: "TEST (2 MINUTES)", value: TEST }
                  ]}
                  onChange={this.handleChange}
                />
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.handleClose}>Cancel</Button>
            <Button primary onClick={this.handleCreate}>
              Create
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

CreateProjectModal.PropTypes = {
  isDisplayed: React.PropTypes.bool.isRequired,
  gasCost: React.PropTypes.number.isRequired,
  currentBlock: React.PropTypes.number.isRequired,
  onCloseModal: React.PropTypes.func.isRequired,
  onHandleProjectCreate: React.PropTypes.func.isRequired
};

export default CreateProjectModal;
