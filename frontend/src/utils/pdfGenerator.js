/**
 * Utility functions for generating PDFs from shoot and credit data
 * Uses html2canvas to capture the visual appearance exactly as shown on screen
 */

export const generateShootPDF = async (shoot) => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create a temporary container with the shoot content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Build the HTML content
    let html = `
      <div style="font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #49306e; margin-bottom: 20px; font-size: 28px;">📋 ${shoot.title || 'Untitled Shoot'}</h1>
        <p style="color: #666; margin-bottom: 30px; font-size: 14px;">
          <strong>Date:</strong> ${new Date(shoot.date).toLocaleDateString()} ${new Date(shoot.date).toLocaleTimeString()}
        </p>
    `;

    // Add categories and items
    if (shoot.template && Array.isArray(shoot.template)) {
      shoot.template.forEach((category) => {
        html += `
          <div style="margin-bottom: 25px;">
            <h2 style="background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
                       color: #333; padding: 12px 16px; border-radius: 8px;
                       margin-bottom: 12px; font-size: 18px; font-weight: 600;">
              ${category.name}
            </h2>
            <div style="margin-left: 20px;">
        `;

        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item) => {
            const isChecked = shoot.checklist?.[item.name]?.takeOut || false;
            const checkmark = isChecked ? '✅' : '❌';
            html += `
              <div style="padding: 8px 0; font-size: 14px; color: #333;">
                ${checkmark} ${item.name}${item.optional ? ' <span style="color: #999; font-size: 12px;">(Optional)</span>' : ''}
              </div>
            `;
          });
        }

        html += `
            </div>
          </div>
        `;
      });
    }

    html += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    document.body.appendChild(container);

    // Capture the container as an image
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF from the canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit the image on the page
    const imgWidth = pageWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let remainingHeight = imgHeight;

    // Add image to PDF, creating new pages if needed
    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);

    // If content is longer than one page, add additional pages
    let currentPage = 1;
    while (remainingHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = -((currentPage * (pageHeight - 20)) - 10);
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      currentPage++;
      remainingHeight -= (pageHeight - 20);
    }

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
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create a temporary container with the credit content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Build the HTML content
    let html = `
      <div style="font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #49306e; margin-bottom: 20px; font-size: 28px;">🎬 Credits</h1>
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Project:</strong> ${credit.projectName || 'Untitled'}
        </p>
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Created by:</strong> ${credit.user?.name || 'Unknown'}
        </p>
        <p style="color: #666; margin-bottom: 30px; font-size: 14px;">
          <strong>Date:</strong> ${new Date(credit.createdAt).toLocaleDateString()}
        </p>
    `;

    // Add roles and people
    if (credit.roles && Array.isArray(credit.roles)) {
      credit.roles.forEach((roleObj) => {
        html += `
          <div style="margin-bottom: 25px;">
            <h2 style="background: linear-gradient(135deg, #49306e 0%, #6b4a8f 100%);
                       color: white; padding: 12px 16px; border-radius: 8px;
                       margin-bottom: 12px; font-size: 18px; font-weight: 600;">
              ${roleObj.role}
            </h2>
            <div style="margin-left: 20px;">
        `;

        if (roleObj.people && Array.isArray(roleObj.people)) {
          roleObj.people.forEach((person) => {
            html += `
              <div style="padding: 8px 0; font-size: 14px; color: #333;">
                • ${person}
              </div>
            `;
          });
        }

        html += `
            </div>
          </div>
        `;
      });
    }

    html += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    document.body.appendChild(container);

    // Capture the container as an image
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF from the canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit the image on the page
    const imgWidth = pageWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let remainingHeight = imgHeight;

    // Add image to PDF, creating new pages if needed
    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);

    // If content is longer than one page, add additional pages
    let currentPage = 1;
    while (remainingHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = -((currentPage * (pageHeight - 20)) - 10);
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      currentPage++;
      remainingHeight -= (pageHeight - 20);
    }

    // Save the PDF
    const fileName = `Credits_${credit.projectName?.replace(/\s+/g, '_') || 'Project'}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating credit PDF:', error);
    throw error;
  }
};

export const generateWaiverPDF = async (waiver) => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create a temporary container with the waiver content
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1200px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#ffffff';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

    // Build the HTML content
    let html = `
      <div style="font-family: system-ui, -apple-system, sans-serif;">
        <h1 style="color: #49306e; margin-bottom: 20px; font-size: 28px;">📑 Image Release and Waiver</h1>
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Name:</strong> ${waiver.name || 'N/A'}
        </p>
        ${waiver.projectName ? `<p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Project:</strong> ${waiver.projectName}
        </p>` : ''}
        ${waiver.projectDate ? `<p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Project Date:</strong> ${waiver.projectDate}
        </p>` : ''}
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Address:</strong> ${waiver.address || 'N/A'}
        </p>
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>City:</strong> ${waiver.city || 'N/A'}, <strong>State:</strong> ${waiver.state || 'N/A'}, <strong>Zip:</strong> ${waiver.zip || 'N/A'}
        </p>
        <p style="color: #666; margin-bottom: 10px; font-size: 14px;">
          <strong>Phone:</strong> ${waiver.phone || 'N/A'}
        </p>
        <p style="color: #666; margin-bottom: 30px; font-size: 14px;">
          <strong>Date Signed:</strong> ${new Date(waiver.date).toLocaleDateString()}
        </p>

        <div style="margin-bottom: 25px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #49306e;">
          <h2 style="color: #49306e; margin-top: 0; font-size: 16px;">Waiver Details</h2>
          <p style="color: #333; font-size: 13px; line-height: 1.6;">
            I hereby grant the Board of Trustees of the Minnesota State Colleges and Universities ("Minnesota State")
            permission to reproduce my name, likeness, identity, voice, photographic image, videographic image, and
            oral or recorded statements in any publication by Minnesota State intended for educational, promotional,
            fund-raising, storytelling or other related use.
          </p>
        </div>

        ${waiver.parentName ? `<div style="margin-bottom: 25px; padding: 15px; background-color: #fff9e6; border-left: 4px solid #f1b40e;">
          <h2 style="color: #49306e; margin-top: 0; font-size: 16px;">Parent/Guardian Information</h2>
          <p style="color: #333; font-size: 13px;">
            <strong>Parent/Guardian Name:</strong> ${waiver.parentName}
          </p>
          ${waiver.parentSignatureDate ? `<p style="color: #333; font-size: 13px;">
            <strong>Signature Date:</strong> ${waiver.parentSignatureDate}
          </p>` : ''}
        </div>` : ''}

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px;">
          Generated on ${new Date().toLocaleDateString()}
        </div>
      </div>
    `;

    container.innerHTML = html;
    document.body.appendChild(container);

    // Capture the container as an image
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF from the canvas
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate dimensions to fit the image on the page
    const imgWidth = pageWidth - 20; // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let yPosition = 10;
    let remainingHeight = imgHeight;

    // Add image to PDF, creating new pages if needed
    pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);

    // If content is longer than one page, add additional pages
    let currentPage = 1;
    while (remainingHeight > pageHeight - 20) {
      pdf.addPage();
      yPosition = -((currentPage * (pageHeight - 20)) - 10);
      pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
      currentPage++;
      remainingHeight -= (pageHeight - 20);
    }

    // Save the PDF
    const fileName = `Waiver_${waiver.name?.replace(/\s+/g, '_') || 'ImageWaiver'}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating waiver PDF:', error);
    throw error;
  }
};

