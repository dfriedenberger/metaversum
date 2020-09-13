package de.frittenburger.vr.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import de.frittenburger.vr.model.Scene;
import de.frittenburger.vr.model.Space;

@Controller
public class PageController {

	private static final Logger logger = LogManager.getLogger(PageController.class);

	@RequestMapping("/")
	public String welcome(@RequestHeader Map<String, String> headers, Map<String, Object> model,
			HttpServletRequest request) {

		headers.forEach((key, value) -> {
			logger.info(String.format("Header '%s' = %s", key, value));
		});

		model.put("header", "Metaversum");
		model.put("message", "The Virtual Reality Metaversum.");

		return "welcome";
	}

	@RequestMapping("/player")
	public String player(HttpServletRequest request) {

		return "player";
	}

	@RequestMapping(
		    value = "/position/{id}", 
		    method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String,Object>> process(@PathVariable("id") String id,@RequestBody Map<String, Object> payload) 
	    throws Exception {

		logger.info(String.format("Payload %s", payload));
		
		return new ResponseEntity<Map<String,Object>>(payload, HttpStatus.OK);

	}
	
	@GetMapping(path = "/space/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Space> space(@PathVariable("id") String id) throws IOException {
		// Get data from service layer into entityList.

		Space space = new Space();
		
		space.scenes.add(getScene(id,"base"));
		space.scenes.add(getScene(id,"deco"));

		
		return new ResponseEntity<Space>(space, HttpStatus.OK);
	}

	private Scene getScene(String id, String type) throws IOException {
		Scene scene = new Scene();
		
		
		ClassLoader cl = this.getClass().getClassLoader();
		scene.assets.addAll(readLines(cl.getResourceAsStream("space/"+id+"/"+type+"_assets.txt"), "UTF-8"));
		scene.entities.addAll(readLines(cl.getResourceAsStream("space/"+id+"/"+type+"_entities.txt"), "UTF-8"));

		return scene;
	}

	private List<String> readLines(InputStream is, String encoding) throws IOException {
	    List<String> result = new ArrayList<>();
		 
		try (BufferedReader br = new BufferedReader(new InputStreamReader(is,encoding))) {
		    while (br.ready()) {
		    	String line = br.readLine().trim();
		    	if(line.isEmpty()) continue;
		        result.add(line);
		    }
		}	
		return result;
	}

}