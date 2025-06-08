import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../../../components/CustomHeader';

const FeeScreen = ({ route }) => {
    const { studentId } = route.params; // Get studentId from navigation params
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feeSummary, setFeeSummary] = useState(null);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('No token found. Please login.');
                }

                const feesResponse = await fetch(
                    `http://tallal.info:5500/api/fees/${studentId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!feesResponse.ok) {
                    const errorData = await feesResponse.json();
                    throw new Error(errorData.error || `HTTP error! status: ${feesResponse.status}`);
                }

                const feesData = await feesResponse.json();
                setFees(feesData);

                const summaryResponse = await fetch(
                  `http://tallal.info:5500/api/fees/summary/${studentId}`,
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
        
                if (!summaryResponse.ok) {
                  const errorData = await summaryResponse.json();
                  throw new Error(errorData.error || `HTTP error! status: ${summaryResponse.status}`);
                }
        
                const summaryData = await summaryResponse.json();
                setFeeSummary(summaryData);


            } catch (err) {
                setError(err.message);
                console.error("Error fetching fees:", err);
                Alert.alert("Error", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, [studentId]);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.row}>
                <Image source={require('../../../../assets/images/coin.png')} style={styles.coinImage} />
                <View style={styles.column}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.deadline}>Deadline: {item.deadline}</Text>
                </View>
                <View style={styles.amountStatusContainer}>
                    <Text style={styles.amount}>{item.amount}</Text>
                    <TouchableOpacity
                        style={[styles.statusButton, item.status === 'Unpaid' ? styles.unpaid : styles.inProgress, item.status === 'Paid' ? styles.paid : null]} // Add Paid style
                    >
                        <Text style={[styles.statusText, item.status === 'Unpaid' ? styles.unpaidText : styles.inProgressText, item.status === 'Paid' ? styles.paidText : null]}> {/* Add Paid text style */}
                            {item.status}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
        <View style={styles.container}>
            <CustomHeader title="PAYMENT" />
            {feeSummary && ( // Conditionally render the summary
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryText}>Total Fees: {feeSummary.total_fees}</Text>
                  <Text style={styles.summaryText}>Total Amount: {feeSummary.total_amount}</Text>
                  <Text style={styles.summaryText}>Paid Amount: {feeSummary.paid_amount}</Text>
                  <Text style={styles.summaryText}>Pending Amount: {feeSummary.pending_amount}</Text>
                </View>
              )}
            <FlatList
                data={fees}
                keyExtractor={(item, index) => index.toString()} // Use index if no id
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5f9',
  },
  list: {
    paddingBottom: 16,
    padding: 16,

  },
  card: {
    backgroundColor: '#e6f7f5',
    borderRadius: 8,
    // padding: 16,
    // marginBottom: 16,
    // elevation: 2,
    borderBottomWidth:1,
    borderBlockColor:"grey",
    marginBottom:8,
    paddingBottom:8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth:1
  },
  coinImage: {
    width: 55,
    height: 55,
    // marginRight: 12,
    // borderWidth:1
  },
  column: {
    // flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    // borderWidth:1,
    width:"52%",
    marginLeft:6,
    // borderWidth:1

  },
  title: {
    fontSize: 11.5,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    // marginBottom: 4,
  },
  deadline: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
  },
  amountStatusContainer: {
    alignItems: 'flex-end',
    width:"28%",
    // borderWidth:1
  },
  amount: {
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    // marginBottom: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',

  },
  unpaid: {
    backgroundColor: 'red',
  },
  inProgress: {
    backgroundColor: '#53ABBB',
  },
  unpaidText: {
    color: 'white',
  },
  inProgressText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
},
paid: {
    backgroundColor: 'green', // Style for Paid status
},
paidText: {
    color: 'white', // Text color for Paid status
},
summaryContainer: {
    backgroundColor: '#e6f7f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // For Android shadow
    alignItems:"center"
},
summaryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 4,
},
});

export default FeeScreen;
