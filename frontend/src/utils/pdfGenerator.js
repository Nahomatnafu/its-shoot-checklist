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

    // Create a temporary container that mimics the actual form styling
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '900px';
    container.style.padding = '40px';
    container.style.backgroundColor = '#f9f9f9';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '8px';

    // Build the form HTML to match the actual form appearance
    let html = `
      <div style="max-width: 900px; margin: 20px auto; padding: 40px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">
          <img src="/minnesota_state_logo.png" alt="Minnesota State Logo" style="height: 80px; width: auto;" />
        </div>

        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 10px; text-align: center;">Image Release and Waiver</h1>

        <p style="margin: 20px 20px; line-height: 1.5;">
          I hereby grant the Board of Trustees of the Minnesota State Colleges and Universities ("Minnesota State") permission to reproduce my name, likeness, identity, voice, photographic image, videographic image, and oral or recorded statements (hereinafter "Recordings") from Minnesota State University, Mankato in any publication by Minnesota State intended for educational, promotional, fund-raising, storytelling or other related use, including public display on webpages and web-based publications. I consent to the public release of the Recordings for the above-stated purposes, pursuant to the consent provisions of the Minnesota Government Data Practices Act (Minnesota Statutes Chapter 13) and/or the Family Educational Rights and Privacy Act, 20 U.S.C. 1232 et seq., if applicable.
        </p>

        <p style="margin: 20px 20px; line-height: 1.5;">
          By signing this form, I hereby waive and release Minnesota State and its officers, agents, and employees, from any claim or liability relating to the use of my name, likeness, identity, voice, photographic image, videographic image, and oral or recorded statements. I hereby waive any right that I may have to inspect or approve the finished Recordings. I understand that the Recordings and copyright will be the sole property of Minnesota State. I understand I may refuse to be photographed or otherwise recorded, and that there are no known consequences of my refusal to do so.
        </p>

        <p style="margin: 20px 20px; line-height: 1.5;">
          I acknowledge that Minnesota State will rely on this waiver and release in producing, broadcasting, and distributing materials containing my name, likeness, identity, voice, photographic image, videographic image or oral or recorded statements, and that I will receive no money or remuneration of any kind from Minnesota State related to the Recordings.
        </p>

        <div style="margin-top: 30px; padding: 20px; background-color: #fff; border: 1px solid #ccc; border-radius: 4px;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Project/Event Name (optional)</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.projectName || ''}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Project/Event Date (optional)</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.projectDate || ''}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Name (required)</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.name || ''}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Address (optional)</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.address || ''}</div>
          </div>

          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
            <div style="flex: 2;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">City (optional)</label>
              <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.city || ''}</div>
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">State (optional)</label>
              <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.state || ''}</div>
            </div>
            <div style="flex: 1;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">Zip (optional)</label>
              <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.zip || ''}</div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Phone (optional)</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.phone || ''}</div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; font-weight: bold; margin-bottom: 5px;">Date</label>
            <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${new Date(waiver.date).toLocaleDateString()}</div>
          </div>

          ${waiver.parentName ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ccc;">
            <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Parent/Guardian Information</h3>

            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">Parent/Guardian Name</label>
              <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.parentName || ''}</div>
            </div>

            ${waiver.parentSignatureDate ? `
            <div style="margin-bottom: 15px;">
              <label style="display: block; font-weight: bold; margin-bottom: 5px;">Parent/Guardian Signature Date</label>
              <div style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; background-color: #f9f9f9;">${waiver.parentSignatureDate || ''}</div>
            </div>
            ` : ''}
          </div>
          ` : ''}
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
      allowTaint: true,
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

