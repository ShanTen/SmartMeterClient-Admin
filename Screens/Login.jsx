import { StyleSheet, Text, View, TextInput } from 'react-native';
import {useState, useEffect} from 'react';
import { ButtonAnimatedWithChild } from '../CommonComponents/ButtonAnimated';
import {apiRoute} from '../makeRequest'

export default function Login({navigation, route}) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [showError, setShowError] = useState(false);
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [token, setToken] = useState(null);

    const handlePress = () => {
        console.log(username, password)
        console.log(apiRoute)

        if (username === null || password === null) {
            setShowError(true);
            return;
        }

        fetch(`${apiRoute}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, username})
        }).then(response => {
            console.log(response)

            if (response.ok) {
                response.json().then(data => {
                    console.log("Login successful")
                    setShowError(false);
                    setToken(data.token);
                    setIsLoginSuccess(true);
                });
            } else {
                console.log("Login failed")
                setShowError(true);
            }
        }
        ).catch(error => {
            console.log("Error: ", error);
        });
    }

    const handlePressTemp = () => {
        setIsLoginSuccess(true);
    }
    
    useEffect(() => {
        if (isLoginSuccess) {
            var passObj = {apiRoute, token}
            navigation.navigate('postAuth', {
                screen: 'Home',
                params: passObj
            });
        }
    }, [isLoginSuccess])


    return (
        <View style={styles.container}>
            <Text>Admin Login</Text>
            <TextInput style={styles.textInputStyle} placeholder="Admin username"  onChangeText={(text) => setUsername(text)}/>
            <TextInput style={styles.textInputStyle} placeholder="Password" secureTextEntry={true} onChangeText={(text) => setPassword(text)}/>
            <ButtonAnimatedWithChild child={
                <Text style={styles.PressableText}>Login</Text>} 
                onPress={handlePress} 
                style={styles.PressableContainer}/>
            {showError && <Text style={styles.errorText}>Invalid username or password</Text>}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInputStyle: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        padding: 5,
        
    },
    PressableContainer: {
        padding: 10,
        borderRadius: 5,
        margin: 10,
        width: 250,
    },
    PressableText: {
        color: 'white',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
    }
});
