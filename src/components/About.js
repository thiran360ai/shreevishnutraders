import React from 'react';
import styles from "../styles/About.module.css"

function About() {
  return (
    <div className={styles['about-content']}>
      <h1>Welcome to Shree Vishnutraders, the crunchy delight makers!</h1>
      <p>
        At Shree Vishnutraders, we're passionate about crafting scrumptious crackers that bring people together.
        Our journey began X years ago with a simple vision: to create tasty, wholesome snacks that
        put a smile on every face.
      </p>

      <h2>Our Story:</h2>
      <p>
        Our founders, [Founder Names], were inspired by their love for baking and sharing treats with family
        and friends. They experimented with unique flavors and recipes, eventually perfecting the art of
        creating crispy, flavorful crackers that quickly became a hit.
      </p>
      <p>
        Today, we're proud to be a leading cracker manufacturer, dedicated to:
      </p>
      <ul>
        <li>Quality: Using only the finest ingredients, sourced locally whenever possible.</li>
        <li>Innovation: Continuously introducing new flavors and products to delight our customers.</li>
        <li>Community: Supporting local initiatives and partnering with organizations that share our values.</li>
      </ul>

      <h2>Our Values:</h2>
      <ul>
        <li>Passion for deliciousness</li>
        <li>Commitment to quality</li>
        <li>Joy in sharing moments</li>
      </ul>


      <h2>What We're Cracking About:</h2>
      <ul>
        <li>Our classic flavors, loved by generations</li>
        <li>Exciting new products, like our vegan and gluten-free ranges</li>
        <li>Collaborations with artisanal partners, creating unique flavor experiences</li>
      </ul>

      <h2>Join the Crunchy Fun:</h2>
      <p>
        Stay updated on new products, recipes, and behind-the-scenes peeks into our bakery. Follow us on social
        media or sign up for our newsletter!
      </p>

      <p>Thank you for being part of our crunchy journey!</p>
    </div>
  );
}

export default About;
