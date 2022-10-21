import * as React from 'react';
import { withTheme } from '@twilio/flex-ui';
import { Theme } from '@twilio-paste/core/theme';
import { Button, Input, Label, Flex, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import WorkerChannelsUtil from '../../utils/WorkerChannelsUtil';

const PLUGIN_NAME = 'ChannelCapacityV2Plugin';

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
    const { worker } = this.props;
    const { chatCapacity, smsCapacity, changed } = this.state;

    return (
      <Theme.Provider theme="flex">
        <Flex vertical>
          <Table>
            <THead>
              <Tr>
                <Th> Channel </Th>
                <Th> Capacity </Th>
              </Tr>
            </THead>
            <TBody>
              <Tr key='chat'>
                <Td> <Label htmlFor="chatCapacity"> Chat </Label></Td>
                <Td>
                  <Input id='chatCapacity' type="number" required value={chatCapacity} onChange={this.handleChange} />
                </Td>
              </Tr>
              <Tr key='sms'>
                <Td> <Label htmlFor="smsCapacity"> SMS </Label></Td>
                <Td>
                  <Input id='smsCapacity' type="number" required value={smsCapacity} onChange={this.handleChange} />
                </Td>
              </Tr>
              <Tr key='button'>
                <Td />
                <Td>
                  <Button variant="primary" size="small"
                    id="saveButton"
                    onClick={this.saveChannelCapacity}
                    disabled={!changed}
                  >
                    Save
                  </Button>

                </Td>
              </Tr>
            </TBody>
          </Table>

        </Flex>
      </Theme.Provider>
    )
  }


}

export default (withTheme(ChannelCapacity));