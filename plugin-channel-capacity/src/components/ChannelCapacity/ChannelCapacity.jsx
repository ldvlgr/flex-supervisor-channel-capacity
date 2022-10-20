import * as React from 'react';
import { Actions, withTheme, Manager, FlexBox } from '@twilio/flex-ui';
import { Button } from "@twilio/flex-ui-core";

import WorkerChannelsUtil from '../../utils/WorkerChannelsUtil';

const PLUGIN_NAME = 'ChannelCapacityPlugin';
//Use select with values 0-5

import { Container, ButtonsContainer } from './ChannelCapacity.styles';

import {
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField
} from "@material-ui/core";

const INITIAL_STATE = {
  chatCapacity: 0,
  chatChannelSid: '',
  chatAvailable: true,
  smsCapacity: 0,
  smsChannelSid: '',
  smsAvailable: true,
  changed: false
}

class ChannelCapacity extends React.Component {
  constructor(props) {
    super(props);
    this.state = INITIAL_STATE;
  }


  async componentDidUpdate(prevProps) {
    console.log(PLUGIN_NAME, 'State = ', this.state);
    // Typical usage (don't forget to compare props):
    if (this.props.worker && this.props.worker !== prevProps.worker) {
      //Init state from worker
      const workerSid = this.props.worker.sid;
      let workerChannels = await WorkerChannelsUtil.getWorkerChannels(workerSid);
      //console.log(PLUGIN_NAME, 'workerChannels = ', workerChannels);
      let wcState = {};
      workerChannels.forEach(wc => {
        if (wc.taskChannelUniqueName == 'chat') {
          wcState.chatChannelSid = wc.sid;
          wcState.chatCapacity = wc.configuredCapacity;
          wcState.chatAvailable = wc.available;
        } else if (wc.taskChannelUniqueName == "sms") {
          wcState.smsChannelSid = wc.sid;
          wcState.smsCapacity = wc.configuredCapacity;
          wcState.smsAvailable = wc.available;
        }
      });
      this.setState(wcState);
    }
  }

  handleChange = e => {
    console.log(PLUGIN_NAME, 'change event ', e.target);
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
  }


  saveChannelCapacity = async () => {
    const workerSid = this.props.worker && this.props.worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      const { chatCapacity, chatChannelSid, smsCapacity, smsChannelSid } = this.state;
      console.log(PLUGIN_NAME, 'Updating Chat Channel Capacity:', chatCapacity);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, chatChannelSid, chatCapacity);
      console.log(PLUGIN_NAME, 'Updating SMS Channel Capacity:', smsCapacity);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, smsChannelSid, smsCapacity);

    }
  }


  render() {
    const { worker, theme } = this.props;
    const { chatCapacity, smsCapacity, changed } = this.state;

    return (
      <Container vertical>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell> Channel </TableCell>
              <TableCell> Capacity </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key='chat'>
              <TableCell> Chat </TableCell>
              <TableCell>
                <TextField id='chatCapacity' value={chatCapacity} onChange={this.handleChange} />
              </TableCell>

            </TableRow>
            <TableRow key='sms'>
              <TableCell> SMS </TableCell>
              <TableCell>
                <TextField id='smsCapacity' value={smsCapacity} onChange={this.handleChange} />
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
        <ButtonsContainer>
          <Button
            id="saveButton"
            onClick={this.saveChannelCapacity}
            disabled={!changed}
            themeOverride={theme.WorkerSkills.SaveButton}
            roundCorners={false}
          >
            SAVE
          </Button>
        </ButtonsContainer>
      </Container>
    )
  }


}

export default (withTheme(ChannelCapacity));