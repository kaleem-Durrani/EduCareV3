import { useNavigation } from '@react-navigation/native';
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = () => {
  const navigation = useNavigation();

  const [activeView, setActiveView] = useState('Rabbit');


  const moments = [
    { title: 'Plant trees together', date: '28/04/2024' },
    { title: 'Exercise together', date: '28/05/2024' },
    { title: 'Study together', date: '28/08/2024' },
    { title: 'Read together', date: '28/08/2024' },
  ];


  return (
    <View style={{}}>
   <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        backgroundColor: '#55A7B5',
        paddingHorizontal: 15,
        paddingVertical: 25,
      }}
    >
      {['Rabbit', 'Lion'].map((view) => (
        <TouchableOpacity
          key={view}
          onPress={() => setActiveView(view)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 50,
              width: 70,
              height: 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              name="owl"
              size={30}
              color={activeView === view ? '#55A7B5' : '#A9A9A9'} // Active icon color
            />
            {activeView === view && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 1,
                  right: 2,
                  backgroundColor: '#55A7B5',
                  borderRadius: 100,
                  padding: 2,
                  borderWidth:3,
                  borderColor:"white"
                }}
              >
                <Icon name="check" size={10} color="#ffffff" />
              </View>
            )}
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: activeView === view ? '#ffffff' : '#B0E0E6', 
              }}
            >
              {view}
            </Text>
            <Text style={{ color: activeView === view ? '#ffffff' : '#B0E0E6' }}>
              {view === 'Rabbit' ? '18 students' : '11 students'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>


    <View style={{ paddingHorizontal: 10, backgroundColor: '#F5F5F5' }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {/* Meal Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('MealScreen')}
        >
          <Icon name="silverware-fork-knife" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Meal</Text>
        </TouchableOpacity>

        {/* Schedule Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('ScheduleScreen')}
        >
          <Icon name="calendar" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Schedule</Text>
        </TouchableOpacity>

        {/* Attendance Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('AttendanceScreen')}
        >
          <Icon name="clipboard-check" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Attendance</Text>
        </TouchableOpacity>

        {/* Health Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('HealthScreen')}
        >
          <Icon name="heart" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Health</Text>
        </TouchableOpacity>

        {/* Fee Invoice Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('FeeInvoice')}
        >
          <Icon name="cash" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Fee Invoice</Text>
        </TouchableOpacity>

        {/* Statistics Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#55A7B5',
            borderRadius: 8,
            width: '31.5%',
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Icon name="chart-bar" size={30} color="white" />
          <Text style={{ color: 'white', marginTop: 10 }}>Statistics</Text>
        </TouchableOpacity>
      </View>
    </View>



      
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 16,
          marginHorizontal:10
        }}>
        <Text style={{fontSize: 16, fontWeight: '500',color:"black"}}>Happy moments</Text>
        <Text style={{color: '#1e88e5'}}>See all</Text>
      </View>



      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row' }}>
        {moments.map((moment, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: '#e0f7fa',
              borderRadius: 8,
              padding: 16,
              marginHorizontal:5,
              width: 200, 
              alignItems: 'center',
              elevation:10,
              marginBottom:10
            }}
          >
            <Icon name="owl" size={40} color="#000" />
            <Text style={{ marginTop: 8 }}>{moment.title}</Text>
            <Text style={{ color: '#888' }}>{moment.date}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </View>



  );
};

export default Dashboard;
