import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getCountryByCode } from '@/lib/countries';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
    color: '#374151',
  },
  contact: {
    fontSize: 10,
    marginBottom: 5,
    color: '#6b7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
});

interface PDFDocumentProps {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  position: string;
  description?: string;
}

const PDFDocument = ({ name, email, countryCode, phone, position, description }: PDFDocumentProps) => {
  const country = getCountryByCode(countryCode);
  const phoneWithCountryCode = country ? `${country.callingCode} ${phone}` : phone;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Professional Profile</Text>
        
        <View style={styles.section}>
          <Text style={styles.title}>Personal Information</Text>
          <Text style={styles.text}>Name: {name}</Text>
          <Text style={styles.contact}>Email: {email}</Text>
          <Text style={styles.contact}>Phone: {phoneWithCountryCode}</Text>
          <Text style={styles.contact}>Position: {position}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.text}>{description || 'No description provided'}</Text>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} • PDF Generator
        </Text>
      </Page>
    </Document>
  );
};

export default PDFDocument;
