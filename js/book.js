const books = [
    {
      subject: "Maths",
      pdf_url: "https://ncert.nic.in/textbook/pdf/lemh1dd.zip"
    },
    {
      subject: "English",
      pdf_url: "https://ncert.nic.in/textbook/pdf/leel1dd.zip"
    },
    {
      subject: "Environmental Studies",
      pdf_url: "https://ncert.nic.in/textbook/pdf/leep1dd.zip"
    }
  ];
  
  const booksContainer = document.getElementById("books-container");
  
  books.forEach(book => {
    const card = document.createElement("div");
    card.className = "book-card";
  
    card.innerHTML = `
      <h3>${book.subject}</h3>
      <a href="${book.pdf_url}" target="_blank">📄 Open PDF</a><br><br>
      <label>🔊 Audio Language:
        <select id="lang-${book.subject}">
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="kn">Kannada</option>
        </select>
      </label><br><br>
      <button onclick="readAloud('${book.subject}', '${book.pdf_url}')">▶ Read Full Book Aloud</button>
    `;
  
    booksContainer.appendChild(card);
  });
  
  async function readAloud(subject, pdfUrl) {
    const lang = document.getElementById(`lang-${subject}`).value;
  
    let voice = "UK English Male";
    if (lang === "hi") voice = "Hindi Female";
    else if (lang === "kn") voice = "Kannada Male";
  
    // Load and extract PDF text
    try {
      responsiveVoice.speak(`Reading ${subject} book in ${lang.toUpperCase()}`, voice);
      
      const loadingMessage = document.createElement("p");
      loadingMessage.innerText = "📖 Extracting book text... Please wait.";
      booksContainer.appendChild(loadingMessage);
  
      const loadingTask = pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      let fullText = "";
  
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items.map(item => item.str).join(" ");
        fullText += text + " ";
      }
  
      loadingMessage.remove();
  
      // Split into chunks (TTS limit)
      const chunks = fullText.match(/.{1,1000}/g);
      let i = 0;
  
      function speakChunk() {
        if (i < chunks.length) {
          responsiveVoice.speak(chunks[i], voice, { onend: speakChunk });
          i++;
        }
      }
  
      speakChunk();
    } catch (error) {
      console.error("Failed to load or read PDF:", error);
      alert("❌ Error reading the PDF. Try another book or check your internet.");
    }
  }