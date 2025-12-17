import PDFDocument from 'pdfkit'
import { EditorElement } from '@/types/editor'

interface TemplateData {
  id: string
  name: string
  elements: EditorElement[]
  width_px: number
  height_px: number
  dpi: 203 | 300
}

interface GeneratePDFParams {
  template: TemplateData
  csvData: Record<string, any>[]
  columnMapping: Record<string, string>
}

/**
 * Generate PDF with labels from template and CSV data
 * Returns buffer that can be saved or sent as download
 */
export async function generateBatchPDF({
  template,
  csvData,
  columnMapping,
}: GeneratePDFParams): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Convert pixels to points (1 inch = 72 points)
      // At 300 DPI: 1 pixel = 72/300 = 0.24 points
      // At 203 DPI: 1 pixel = 72/203 = 0.354 points
      const dpi = template.dpi || 203
      const pointsPerPixel = dpi === 300 ? 72 / 300 : 72 / 203
      
      const labelWidth = template.width_px * pointsPerPixel
      const labelHeight = template.height_px * pointsPerPixel

      // Create PDF document
      const doc = new PDFDocument({
        size: [labelWidth, labelHeight],
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
      })

      const chunks: Buffer[] = []

      doc.on('data', (chunk) => {
        chunks.push(chunk)
      })

      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks)
        resolve(pdfBuffer)
      })

      doc.on('error', (error) => {
        reject(error)
      })

      // Generate one page per CSV row
      csvData.forEach((rowData, index) => {
        if (index > 0) {
          doc.addPage({
            size: [labelWidth, labelHeight],
            margins: { top: 0, bottom: 0, left: 0, right: 0 },
          })
        }

        // Render each element from template
        template.elements
          .sort((a, b) => a.z_index - b.z_index)
          .forEach((element) => {
            if (!element.visible) return

            // Fill in template variables with CSV data
            const filledElement = fillTemplateVariables(element, rowData, columnMapping)

            // Render element based on type
            renderElement(doc, filledElement, pointsPerPixel)
          })
      })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Fill template variables in element properties with CSV data
 */
function fillTemplateVariables(
  element: EditorElement,
  rowData: Record<string, any>,
  columnMapping: Record<string, string>
): EditorElement {
  if (element.type !== 'text') return element

  const textElement = element as any
  let text = textElement.properties.text || ''

  // Replace {{variable}} with CSV data
  Object.entries(columnMapping).forEach(([csvColumn, mappedField]) => {
    const value = rowData[csvColumn]
    if (value !== undefined && value !== null) {
      // Replace {{mappedField}} or {{variable}} patterns
      const pattern = new RegExp(`\\{\\{${mappedField}\\}\\}`, 'g')
      text = text.replace(pattern, String(value))
    }
  })

  // Also replace direct CSV column names
  Object.keys(rowData).forEach((csvColumn) => {
    const value = rowData[csvColumn]
    if (value !== undefined && value !== null) {
      const pattern = new RegExp(`\\{\\{${csvColumn}\\}\\}`, 'g')
      text = text.replace(pattern, String(value))
    }
  })

  return {
    ...element,
    properties: {
      ...textElement.properties,
      text,
    },
  } as EditorElement
}

/**
 * Render an element to PDF document
 */
function renderElement(
  doc: PDFDocument,
  element: EditorElement,
  pointsPerPixel: number
) {
  const x = element.x * pointsPerPixel
  const y = element.y * pointsPerPixel
  const width = element.width * pointsPerPixel
  const height = element.height * pointsPerPixel

  // Save state for rotation
  doc.save()

  // Apply rotation if needed
  if (element.rotation !== 0) {
    const centerX = x + width / 2
    const centerY = y + height / 2
    doc.translate(centerX, centerY)
    doc.rotate((element.rotation * Math.PI) / 180)
    doc.translate(-centerX, -centerY)
  }

  switch (element.type) {
    case 'text':
      renderTextElement(doc, element as any, x, y, width, height)
      break
    case 'image':
      // Image rendering would require loading images
      // For now, draw a placeholder rectangle
      doc.rect(x, y, width, height).stroke()
      break
    case 'barcode':
      // Barcode rendering would require barcode image generation
      // For now, draw a placeholder
      doc.rect(x, y, width, height).stroke()
      doc.fontSize(8)
      doc.text((element as any).properties.barcode_value || 'BARCODE', x, y + height / 2)
      break
    case 'shape':
      renderShapeElement(doc, element as any, x, y, width, height)
      break
  }

  doc.restore()
}

/**
 * Render text element
 */
function renderTextElement(
  doc: PDFDocument,
  element: any,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const props = element.properties

  // Set font (default to Helvetica if not available)
  const fontMap: Record<string, string> = {
    Inter: 'Helvetica',
    Arial: 'Helvetica',
    'Times New Roman': 'Times-Roman',
    Monospace: 'Courier',
  }

  const fontName = fontMap[props.font] || 'Helvetica'
  const fontSize = props.fontSize || 12
  const fontWeight = props.fontWeight || 400

  // PDFKit font weights
  let fontType = fontName
  if (fontWeight >= 700) {
    fontType = `${fontName}-Bold`
  } else if (fontWeight >= 600) {
    fontType = `${fontName}-Bold` // Approximate
  } else if (fontWeight >= 500) {
    fontType = `${fontName}` // Medium not directly supported
  }

  doc.font(fontType).fontSize(fontSize)

  // Set text color
  const color = props.color || '#000000'
  doc.fillColor(color)

  // Set alignment
  const alignMap: Record<string, 'left' | 'center' | 'right' | 'justify'> = {
    left: 'left',
    center: 'center',
    right: 'right',
    justify: 'justify',
  }
  const align = alignMap[props.align] || 'left'

  // Render text
  const text = props.text || ''
  const lines = text.split('\n')
  const lineHeight = fontSize * (props.lineHeight || 1.2)

  lines.forEach((line: string, index: number) => {
    const lineY = y + index * lineHeight

    if (align === 'left') {
      doc.text(line, x, lineY, { width, align: 'left' })
    } else if (align === 'center') {
      doc.text(line, x, lineY, { width, align: 'center' })
    } else if (align === 'right') {
      doc.text(line, x, lineY, { width, align: 'right' })
    } else {
      doc.text(line, x, lineY, { width, align: 'justify' })
    }
  })
}

/**
 * Render shape element
 */
function renderShapeElement(
  doc: PDFDocument,
  element: any,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const props = element.properties

  // Set colors
  const fillColor = props.fill_color || '#000000'
  const strokeColor = props.border_color || '#000000'
  const borderWidth = props.border_width || 1

  doc.strokeColor(strokeColor).lineWidth(borderWidth)

  if (props.fill_opacity > 0) {
    doc.fillColor(fillColor).opacity(props.fill_opacity / 100)
  }

  switch (props.shape_type) {
    case 'rectangle':
      if (props.fill_opacity > 0) {
        doc.rect(x, y, width, height).fill()
      }
      doc.rect(x, y, width, height).stroke()
      break

    case 'circle':
      const radius = Math.min(width, height) / 2
      const centerX = x + width / 2
      const centerY = y + height / 2

      if (props.fill_opacity > 0) {
        doc.circle(centerX, centerY, radius).fill()
      }
      doc.circle(centerX, centerY, radius).stroke()
      break

    case 'line':
      doc.moveTo(x, y)
      doc.lineTo(x + width, y + height)
      doc.stroke()
      break
  }

  // Reset opacity
  doc.opacity(1)
}

