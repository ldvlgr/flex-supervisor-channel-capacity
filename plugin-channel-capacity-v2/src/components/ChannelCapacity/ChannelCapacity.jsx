import React, { useState, useEffect } from 'react';

import { Button, Select, Option, Label, Flex, Box, Table, THead, TBody, Th, Tr, Td, Switch } from "@twilio-paste/core";

import WorkerChannelsUtil from '../../utils/WorkerChannelsUtil';
import { PLUGIN_NAME } from '../../utils/constants';

const ChannelCapacity = ({ worker }) => {
  const [changed, setChanged] = useState(false);

  const [voiceCapacity, setVoiceCapacity] = useState(0);
  const [voiceChannelSid, setVoiceChannelSid] = useState('');
  const [voiceAvailable, setVoiceAvailable] = useState(true);

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
        if (wc.taskChannelUniqueName == 'voice') {
          setVoiceChannelSid(wc.sid);
          setVoiceCapacity(wc.configuredCapacity);
          setVoiceAvailable(wc.available);
        } else if (wc.taskChannelUniqueName == 'chat') {
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
      //Auto disable
      setChatAvailable(false);
    } else {
      //Auto enable?
      //setChatAvailable(true);
    }
  }

  const handleSmsChange = (e) => {
    setChanged(true);
    const capacity = e.target.value;
    setSmsCapacity(capacity);
    if (capacity == 0) {
      //Auto disable
      setSmsAvailable(false);
    } else {
      //Auto enable?
      //setSmsAvailable(true);
    }
  }

  const handleVoiceChange = (e) => {
    setChanged(true);
    const capacity = e.target.value;
    setVoiceCapacity(capacity);
    if (capacity == 0) {
      //Auto disable
      setVoiceAvailable(false);
    } else {
      //Auto enable?
      //setVoiceAvailable(true);
    }
  }

  const saveChannelCapacity = async () => {
    const workerSid = worker && worker.sid;
    //Only save if worker was selected
    if (workerSid) {
      console.log(PLUGIN_NAME, 'WorkerSid:', workerSid);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, voiceChannelSid, voiceCapacity, voiceAvailable);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, chatChannelSid, chatCapacity, chatAvailable);
      WorkerChannelsUtil.updateWorkerChannelCapacity(workerSid, smsChannelSid, smsCapacity, smsAvailable);

    }
    setChanged(false);
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
            <Tr key='voice'>
              <Td>
                <Switch checked={voiceAvailable} onChange={() => { setVoiceAvailable(!voiceAvailable); }} >
                  <Label htmlFor="voiceCapacity"> Voice </Label>
                </Switch>
              </Td>
              <Td>
                <Select
                  value={voiceCapacity}
                  onChange={handleVoiceChange}
                  id="voiceCapacity"
                >
                  <Option key="voiceOff" value={0}> 0 </Option>
                  <Option key="voiceOn" value={1}> 1 </Option>
                </Select>
              </Td>
            </Tr>
            <Tr key='chat'>
              <Td>
                <Switch checked={chatAvailable} onChange={() => { setChatAvailable(!chatAvailable); }} >
                  <Label htmlFor="chatCapacity"> Chat </Label>
                </Switch>
              </Td>
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
              <Td>
                <Switch checked={smsAvailable} onChange={() => { setSmsAvailable(!smsAvailable); }} >
                  <Label htmlFor="smsCapacity"> SMS </Label>
                </Switch>
              </Td>
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