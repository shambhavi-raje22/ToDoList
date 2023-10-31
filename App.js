import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from 'react-native';
import Task from './Components/Task';
import * as LocalAuthentication from 'expo-local-authentication';


export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  let [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function authenticate() {
      const result = await LocalAuthentication.authenticateAsync();
      setIsAuthenticated(result.success);
    }
    authenticate();
  }, []);

  const handleAddTask = () => {
    Keyboard.dismiss();

    if (selectedTaskIndex === null) {
      // If no task is selected, add a new task
      setTaskItems([...taskItems, task]);
    } else {
      // If a task is selected, update the selected task
      const updatedTaskItems = [...taskItems];
      updatedTaskItems[selectedTaskIndex] = task;
      setTaskItems(updatedTaskItems);
      setSelectedTaskIndex(null); // Reset the selected task
    }

    setTask('');
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  const editTask = (index) => {
    setTask(taskItems[index]);
    setSelectedTaskIndex(index); // Set the selected task for updating
  };

  return (
    <View style={styles.container}>
      <Text>{isAuthenticated }</Text>
      <StatusBar style="auto" />
    
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when the list gets longer than the page */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps='handled'
      >

        {/* Today's Tasks */}
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <View style={styles.items}>
            {/* This is where the tasks will go! */}
            {taskItems.map((item, index) => (
              <TouchableOpacity key={index} onLongPress={() => editTask(index)} onPress={() => completeTask(index)}>
                <Task text={item} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={selectedTaskIndex !== null ? 'Update task' : 'Write a task'}
            value={task}
            onChangeText={(text) => setTask(text)}
          />
          <TouchableOpacity style={styles.addWrapper} onPress={() => handleAddTask()}>
            <Text style={styles.addText}>
              {selectedTaskIndex !== null ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
   input: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    flex: 1, // Make the input field take all available space
  },

  addWrapper: {
    width: 100, // Adjust the width to position it more to the right
    height: 60,
    backgroundColor: '#021691',
    borderRadius: 10, // Reducing border radius
    justifyContent: 'center',
    alignItems: 'center',
    right:24
  },
  addText: {
    color: '#FFF',
  },
  removeText: {
    color: 'red',
    marginLeft: 10,
  },
});
