function menuFunction() {
  var x = document.getElementById("myLinks");
  if(x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

  const sbtn = document.querySelector('button')
  const input = document.querySelector('#textsend')
  
  sbtn.addEventListener('click', () => {
    console.log(input.elements["comments"].value)
  Email.send({
      Host: "smtp.mail.yahoo.com",
      Username: "",
      Password: "",
      To: "recipient@example.com",
      From: "sender@example.com",
      Subject: "Test email",
      Body: input.elements["comments"].value
  }).then(
    message => alert("Message was sent successfully!")
  );
  })