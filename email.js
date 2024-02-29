document.getElementById("emailForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form data
    var formData = new FormData(this);
    
    // Send form data to server-side script
    fetch("send_email.php", {
      method: "POST",
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert("Email sent successfully!");
        // Optionally, clear form fields after successful submission
        this.reset();
      } else {
        alert("Error: unable to send email");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("Error: unable to send email");
    });
  });
  