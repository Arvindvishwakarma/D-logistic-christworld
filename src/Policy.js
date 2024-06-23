import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import logo from "../assets/Img/newlogo.jpeg"
import Feather from 'react-native-vector-icons/Feather';

export default function Policy({ navigation }) {
    return (
        <View style={{ backgroundColor: "#fff", height: "100%" }}>
            <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" style={{ marginLeft: 12, color: "#3498db" }} size={25} />
                </TouchableOpacity>
                <View style={{ width: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                    <Image source={logo} style={{ width: 70, height: 70, borderRadius: 100 }} />
                    <Text style={{ color: "#000", fontFamily: "Poppins-Medium", fontSize: 13 }}>Privacy Policy</Text>
                    <View style={{ width: "90%", height: 2, backgroundColor: "#3498db", marginTop: 10 }}></View>
                </View>

                <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <View style={{ width: "90%" }}>
                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            Christ World has clear guidelines in place to maintain a respectful and devout environment for its users.
                            If someone violates these rules by engaging in inappropriate behavior or sharing content that contradicts
                            the platform’s policies, Christ World will take strict actions against those users to ensure the sanctity of
                            the community and uphold its principles of fostering Christian unity and spiritual growth.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            Christ World is a devotional platform dedicated to uniting the Christian community in fellowship and
                            devotion to Jesus Christ. The platform strictly prohibits any content related to shame, nudity, body
                            shaming, or promotion of Hollywood/Bollywood. Its terms and conditions emphasize creating a space
                            solely for fostering Christian unity and spiritual growth.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            If somebody break our rules and policy aap will take strict action for them.
                        </Text>

                        <Text style={{ color: "#000", fontFamily: "Poppins-Medium", fontSize: 13, textAlign: "center", marginTop: 10 }}>Terms & Conditions</Text>


                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            1.Code of Conduct: Clearly outline acceptable and unacceptable behaviors within the app. This could
                            cover respectful communication, appropriate content sharing, and guidelines against discrimination or
                            hate speech
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            2.Content Guidelines: Specify what type of content is permitted and prohibited. For a devotional app,
                            this might involve allowing only religious content, prohibiting explicit material, or content that
                            contradicts the app’s religious values.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            3. Privacy Policy: Detail how user data is collected, stored, and used. It should address user privacy, data
                            sharing (if any), and how the app complies with relevant data protection laws.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            4.User Responsibilities: Clearly state the responsibilities and expectations of users while using the app.
                            This could include respecting others, abiding by the community guidelines, and reporting inappropriate
                            content or behavior.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            5. Enforcement and Consequences: Explain the consequences of violating the terms and conditions,
                            which might include warnings, suspension, or removal from the platform. Describe the enforcement
                            process and how users can appeal decisions.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            6. Intellectual Property: Address ownership and usage rights for content shared on the platform, both by
                            the app and its users.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            7. Updates and Changes: Specify how and when the terms may change and how users will be informed
                            about these changes.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            8. Legal Disclaimers: Include disclaimers regarding the app’s limitations, liabilities, and warranties.
                        </Text>
                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            9. Contact Information: Provide contact details for users to reach out for support, inquiries, or reporting
                            violations.
                        </Text>

                        <Text style={{ textAlign: "center", marginTop: 15, fontSize: 10, color: "#000" }}>
                            Remember, the specifics of these policies will depend on the app’s nature, target audience, and legal
                            jurisdiction. It’s crucial to ensure these policies are clear, accessible, and aligned with applicable laws and
                            user expectations. Consulting legal counsel is advisable to draft robust terms and conditions for any app.
                        </Text>

                    </View>

                </View>


            </ScrollView>
        </View>
    )
}