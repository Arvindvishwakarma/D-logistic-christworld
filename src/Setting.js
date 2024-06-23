import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import Feather from 'react-native-vector-icons/Feather';
import { AuthContext } from './context/Authcontext';
import Entypo from 'react-native-vector-icons/Entypo';
export default function Setting({ navigation }) {
    const { logOut } = useContext(AuthContext)
    return (
        <View style={{ height: "100%", backgroundColor: "#fff" }}>
            
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Feather name="arrow-left" size={20} style={{ marginTop: 7, marginLeft: 10, color: "#000" }} />
                    <Text style={{ marginLeft: 10, fontSize: 23, fontFamily: "Poppins-SemiBold", color: "#000" }}>Setting</Text>
                </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                <TouchableOpacity onPress={() => logOut()}>
                    <View style={{ flexDirection: "row", width: "95%" }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <Entypo name="log-out" size={19} color="#000" style={{ marginTop: 2 }} />
                            <Text style={{ color: "#000", fontSize: 15, marginLeft: 10, fontFamily: "Poppins-SemiBold" }}>Log Out</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                <TouchableOpacity onPress={() =>navigation.navigate("Policy")}>
                    <View style={{ flexDirection: "row", width: "95%" }}>
                        <View style={{ flexDirection: "row", width: "100%" }}>
                            <Entypo name="news" size={19} color="#000" style={{ marginTop: 2 }} />
                            <Text style={{ color: "#000", fontSize: 15, marginLeft: 10, fontFamily: "Poppins-SemiBold" }}>Privacy Policy</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        </View>
    )
}