import React from "react";
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { ButtonAnimatedWithChild } from "../CommonComponents/ButtonAnimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native'
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-reanimated-table';

function epoch2Date(epoch){
    //converts epoch to date
    //epoch is in ms 
    var date = new Date(epoch);
    return date.toDateString();
}

function Title(){
    return <Text style={{fontSize: 20, fontWeight: "bold", marginTop: 70}}>Single Meter Readings</Text>;
}

function Underline(){
    return <View style={{width: 200, borderBottomColor: "black", borderBottomWidth: 1, margin: 10}} />;
}

function SearchBar({handlePress}) {
    const [meterID, setMeterID] = useState(null);

    return <View style={styles.searchBar}>
            <TextInput inputMode="numeric" onChangeText={(text) => setMeterID(text)} style={styles.searchBox} placeholder="Search for a meter Ex: 1001" />
            <ButtonAnimatedWithChild
                child={<MaterialCommunityIcons name="magnify" size={20} color="white" />}
                onPress={() => handlePress(meterID)}
                style={{ backgroundColor: "#069A8E", marginLeft: 5, width: "13%", borderRadius: 10}}
            />

        </View>;
}

function ErrorBox({isError}) {
    return (isError && <Text style={{color: "red", marginTop: 10}}>Please enter a valid meter ID</Text>);
}

function ConsumptionTable({data, displayUnits='kWh'}){
    //returns a table component
    /*
        Data:
            [
                [ 1, 1001, 1711218660, 230, 5.2, 1196, 25.6, 50, 0.98 ],
                [ 2, 1001, 1711305060, 228, 5.3, 1208, 26.1, 49.8, 0.97 ]
            ]

            Row: logID, meterID, TimeStamp, Voltage, Current, Energy, WattHour, Frequency, PowerFactor

            We only need: TimeStamp, WattHour (kiloWatthour) in a table

    */
        
    var tableData = {};
    tableData.head = ['Date', `Consumption (${displayUnits})`];
    tableData.data = [];    

    var sortedData = data.sort((a, b) => a[2] - b[2]);

    sortedData.forEach(row => {
        var date = epoch2Date(row[2]);

        if(displayUnits === 'kWh')
            var consumption = (row[5]/1_000).toFixed(2); //convert to kWh
        else if(displayUnits === 'Wh')
            var consumption = row[5].toFixed(2); //convert to Wh
        else {
            console.log("Invalid display units, defaulting to Wh")
            var consumption = row[5].toFixed(2); 
        }
        
        tableData.data.push([date, consumption]);
    });

    //sort data by ascending epoch
    var sortedData = tableData.data.sort((a,b) => {
        if (a[2] === b[2]) {
            return 0;
        }
        else {
            return (a[0] < b[0]) ? -1 : 1;
        }
    })

    console.log(sortedData)

    return(
        <Table>
            <Row data={tableData.head} style={styles.head} textStyle={styles.text}/>
            <Rows data={sortedData} style={styles.row} textStyle={styles.text}/>
        </Table>
    )

}


export default function PrimarySearchAndViewSingleMeter({navigation, route}) {
    const [meterID,setMeterID] = useState(null);
    
    const [isDataSet, setIsDataSet] = useState(false);

    const [isError, setIsError] = useState(false);
    const [showError, setShowError] = useState(false);

    const [data, setData] = useState(null);
    const [displayUnits, setDisplayUnits] = useState("Wh");
    const [sendRequest, setSendRequest] = useState(false);

    // const apiRoute = route.params.apiRoute;
    // const token = route.params.token;
    
    // useEffect(() => {

    //     if (sendRequest) {
    //         axios.get(`${apiRoute}/log-data/${meterID}`, {
    //             headers: {
    //                 "x-auth-token": token
    //             }
    //         }).then((response) => {
    //             if (response.status === 200) {
    //                 setData(response.data);
    //                 setIsDataSet(true);
    //                 setIsError(false);
    //             }
    //         }).catch((error) => {
    //             setIsError(true);
    //             console.log(error);
    //         });
    //     }
    // }
    // , [sendRequest]);

    // useEffect(() => {
    //     if (!isDataSet) return;
    //     if (sendRequest) setSendRequest(false);

    //     console.log(data)
    //     console.log(isDataSet)
    // }, [data]);

    const handlePress = (_id) => {
        //strip any whitespace
        if(!_id) return;

        _id = _id.replace(/\s/g, '');

        console.log(`Got a press call id is [${_id}]`) ;

        if (_id === null || _id === "" || isNaN(_id)) {
            setShowError(true);
            return;
        }
        else{
            console.log("hit---")
            setShowError(false);
            setMeterID(_id);
            setSendRequest(true);
        }
    }
    
    return <View style={styles.container}>
        <Title />
        <Underline />
        <SearchBar handlePress={handlePress}/>
        <View style={styles.scrollViewContainer}>
                <ScrollView contentContainerStyle={styles.consumptionContainer}>
                    {isDataSet && <ConsumptionTable data={data.data} displayUnits={displayUnits}/>}
                    {isError && <Text style={styles.ErrorText}>Error: Could not retrieve data</Text>}
                </ScrollView>
        </View>
        <ErrorBox isError={showError} />
    </View>;
}

const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    searchBar: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius: 10,
        // backgroundColor: "#069A8E",
        shadowColor: "grey",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    searchBox: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: "#fff",
        shadowColor: "grey",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    scrollViewContainer: {
        flex: 1,
        width: "100%",
        marginTop: 20,
    },
    consumptionContainer: {
        flex: 0,
        justifyContent: 'flex-start',
        width: Math.floor(ScreenWidth*0.9),
    },
    scrollViewContainer:{
        height: Math.floor(ScreenHeight*0.9),
    },
});