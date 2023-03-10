import React, { useState, useEffect } from 'react';

import { Button, Select, Option, Label, Flex, Box, Table, THead, TBody, Th, Tr, Td } from "@twilio-paste/core";

import WorkerChannelsUtil from '../../utils/WorkerChannelsUtil';
import { PLUGIN_NAME } from '../../utils/constants';

const ChannelCapacity = ({ worker }) => {
  const [changed, setChanged] = useState(false);
  const [chatCapacity, setChatCapacity] = useState(0);
  const [chatChannelSid, setChatChannelSid] = useState('');
  const [chatAvailable, setChatAvailable] = useState(true);
  const [smsCapacity, setSmsCapacity] = useState(0);
  const [smsChannelSid, setSmsChannelSid] = useState('');
  const [smsAvailable, setSmsAvailable] = useState(true);

  useEffect(async () => {
    if (worker) {
      console.log(PLUGIN_NAME, 'worker = ', worker);
      let workerChannels = await WorkerChannelsUtil.getWorkerChannels(worker.sid);
      console.log(PLUGIN_NAME, 'workerChannels = ', workerChannels);
      workerChannels.forEach(wc => {
        if (wc.taskChannelUniqueName == 'chat') {
          setChatChannelSid(wc.sid);
          setChatCapacity(wc.configuredCapacity);
          setChatAvailable(wc.available);
        } else if (wc.taskChannelUniqueName == "sms") {
          setSmsChannelSid(wc.sid);
          setSmsCapacity(wc.configuredCapacity);
          setSmsAvailable(wc.available);
        }
      });
    }
  }, [worker]);

  const handleChatChange = (e) => {
    setChanged(true);
    const capacity = e.target.value;
    setChatCapacity(capacity);
    if (capacity == 0) {
      setChatAvailable(false);
    } else {
      setChatAvailable(true);
    }
  }

  const handleSmsChange = (e) => {
    setChanged(true);
    const capacity = e.target.value;
    setSmsCapacity(capacity);
    if (capacity == 0) {
      setSmsAvailable(false);
    } else {
      setSmsAvailable(true);
    }
  }

  const saveChannelCapacity = async () => {
    const workerSid = worker && worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      console.log(PLUGIN_NAME, 'Updating Chat Channel Capacity:', chatCapacity);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, chatChannelSid, chatCapacity);
      console.log(PLUGIN_NAME, 'Updating SMS Channel Capacity:', smsCapacity);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, smsChannelSid, smsCapacity);

    }
  }
  const options = [0, 1, 2, 3, 4, 5];

  return (
      <Flex vertical padding="space50" grow >
        <Box width="100%">
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
                <Select
                  value={chatCapacity}
                  onChange={handleChatChange}
                  id="chatCapacity"
                >
                  {options.map((option) => {
                    return (<Option key={option} value={option}> {option} </Option>)
                  })}
                </Select>
              </Td>
            </Tr>
            <Tr key='sms'>
              <Td> <Label htmlFor="smsCapacity"> SMS </Label></Td>
              <Td>
                <Select
                  value={smsCapacity}
                  onChange={handleSmsChange}
                  id="smsCapacity"
                >
                  {options.map((option) => {
                    return (<Option key={option} value={option}> {option} </Option>)
                  })}
                </Select>
              </Td>
            </Tr>
            <Tr key='button'>
              <Td />
              <Td>
                <Button variant="primary" size="small"
                  id="saveButton"
                  onClick={saveChannelCapacity}
                  disabled={!changed}
                >
                  Save
                </Button>
              </Td>
            </Tr>
          </TBody>
        </Table>
      </Box>
    </Flex>
  )

}

export default ChannelCapacity;