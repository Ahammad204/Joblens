// CVDocument.js
import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
  listItem: { marginLeft: 10 },
});

// CV Document
const CVDocument = ({ cv }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>{cv.personalInfo.name}</Text>
        <Text>{cv.personalInfo.email}</Text>
        <Text>{cv.professionalSummary}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {cv.experience?.map((exp, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <Text>{exp.role} @ {exp.company}</Text>
            {exp.description.map((d, j) => (
              <Text key={j} style={styles.listItem}>• {d}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        {cv.projects?.map((proj, i) => (
          <View key={i} style={{ marginBottom: 5 }}>
            <Text>{proj.title}</Text>
            {proj.description.map((d, j) => (
              <Text key={j} style={styles.listItem}>• {d}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skills & Tools</Text>
        <Text>{cv.skills?.join(", ")} | {cv.tools?.join(", ")}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Recommendations</Text>
        {cv.recommendations?.map((r, i) => (
          <Text key={i} style={styles.listItem}>• {r}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default CVDocument;
