import { useState,useEffect } from "react";
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import Footer from '@/components/footer/Footer';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import Accordionleft from "./Accordion";
import Centerads from  "./Centerads"
import Content from "./Content"
import Title from "./Title"
import SimilarReads from "./SimilarReads.js";
import Advertisement from  "./Advertisement"
export default function LodashLayout() {
  const [curriculum, setCurriculum] = useState([]); // Holds fetched data
  const [selectedContent, setSelectedContent] = useState(null); // Manages selected content
  const [loading, setLoading] = useState(false);








  

  return (
    <Box sx={{ bgcolor: "#212121", color: "#fff", minHeight: "100vh", }}>
      <Grid container spacing={1}>
        {/* Left Accordion Menu */}
        <Grid
          item
          xs={12}
          md={3}
        
        >

         
          <Accordionleft
        
          
          />
       
       
        </Grid>

        {/* Center Content */}
        <Grid item xs={12} md={7} >
        <Advertisement/>
          <Centerads/>
          <Title
            />
<Content
/>


          <SimilarReads/>
        </Grid>

        {/* Right Ads Section */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{
          //  bgcolor: "#1e1e1e",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card 
          sx={{ maxWidth: 300, bgcolor: "#212121", color: "#fff" }}
          
          >
            <CardContent>
           
              <Advertisement/>
              <Advertisement/>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Menu Icon for Mobile */}
      <Footer/>
    </Box>
  );
}