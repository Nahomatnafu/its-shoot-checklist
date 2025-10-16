/**
 * Utility functions for generating PDFs from shoot and credit data
 */

export const generateShootPDF = async (shoot) => {
  try {
    const { jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 15;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(73, 48, 110); // Purple color
    pdf.text('Shoot Checklist', margin, yPosition);
    yPosition += 12;
    
    // Shoot Title
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Title: ${shoot.title || 'Untitled'}`, margin, yPosition);
    yPosition += 8;
    
    // Shoot Date
    pdf.setFontSize(11);
    pdf.text(`Date: ${shoot.date || 'No date'}`, margin, yPosition);
    yPosition += 10;
    
    // Separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Checklist items
    pdf.setFontSize(11);
    
    if (shoot.template && Array.isArray(shoot.template)) {
      shoot.template.forEach((category) => {
        // Category header
        pdf.setFontSize(12);
        pdf.setTextColor(73, 48, 110);
        pdf.text(category.name, margin, yPosition);
        yPosition += 7;
        
        // Category items
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item) => {
            const isChecked = shoot.checklist?.[item.name]?.takeOut || false;
            const status = isChecked ? '✓' : '✗';
            const itemText = `${status} ${item.name}${item.optional ? ' (Optional)' : ''}`;
            
            // Check if we need a new page
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 15;
            }
            
            pdf.text(itemText, margin + 5, yPosition);
            yPosition += 6;
          });
        }
        
        yPosition += 3;
      });
    }
    
    // Footer with generation date
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    const generatedDate = new Date().toLocaleDateString();
    pdf.text(`Generated on ${generatedDate}`, margin, pageHeight - 10);
    
    // Save the PDF
    const fileName = `Shoot_${shoot.title?.replace(/\s+/g, '_') || 'Checklist'}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating shoot PDF:', error);
    throw error;
  }
};

export const generateCreditPDF = async (credit) => {
  try {
    const { jsPDF } = await import('jspdf');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 15;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    
    // Title
    pdf.setFontSize(20);
    pdf.setTextColor(73, 48, 110); // Purple color
    pdf.text('Credits', margin, yPosition);
    yPosition += 12;
    
    // Project Name
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Project: ${credit.projectName || 'Untitled'}`, margin, yPosition);
    yPosition += 8;
    
    // Created By
    pdf.setFontSize(11);
    pdf.text(`Created by: ${credit.user?.name || 'Unknown'}`, margin, yPosition);
    yPosition += 8;
    
    // Date
    const creditDate = new Date(credit.createdAt).toLocaleDateString();
    pdf.text(`Date: ${creditDate}`, margin, yPosition);
    yPosition += 10;
    
    // Separator line
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Roles and people
    pdf.setFontSize(11);
    
    if (credit.roles && Array.isArray(credit.roles)) {
      credit.roles.forEach((roleObj) => {
        // Role header
        pdf.setFontSize(12);
        pdf.setTextColor(73, 48, 110);
        pdf.text(roleObj.role, margin, yPosition);
        yPosition += 7;
        
        // People in this role
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        
        if (roleObj.people && Array.isArray(roleObj.people)) {
          roleObj.people.forEach((person) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 15;
            }
            
            pdf.text(`• ${person}`, margin + 5, yPosition);
            yPosition += 6;
          });
        }
        
        yPosition += 3;
      });
    }
    
    // Footer with generation date
    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    const generatedDate = new Date().toLocaleDateString();
    pdf.text(`Generated on ${generatedDate}`, margin, pageHeight - 10);
    
    // Save the PDF
    const fileName = `Credits_${credit.projectName?.replace(/\s+/g, '_') || 'Project'}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating credit PDF:', error);
    throw error;
  }
};

