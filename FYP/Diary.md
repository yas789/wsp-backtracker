**Week 29 Sep - 6th Oct**



This week i researched quite a bit into my project getting a good understanding  of the problem at hand , and made some progress this is is summary:

* **Research:**
  * Looked in to Computational complexity classes (P , NP , P-complete ..) and their implications mainly revisiting the P vs NP problem and refreshing my understading from the last few weeks of CS2860 
  * Started to take detailed notes on Gregory Gutin's paper on WSP problem , mainly looking at FPT tractability by reducing *k* number of steps in the workflow .
* **Problem Exploration**
  * looked into the Vertex cover problem as it's an early deliverable 
  * looked into some possible implementations of the problem such as approximations etc.
* **Reading**
  * Main reading : "Parameterized Algorithms " as reccomended by my supervisor

**Next Steps**

* Continue looking into Parameterized complexity and the vertex cover problem 
* To practice some backtracking LeetCode problems focusing on graph algorithms , to familiarise  myself with the techniques
* Start writing Report using all the notes i have been taking

***

**Week 7 Oct - 13th Oct**

- *Plan*
  - Finished plan
  - Researched into relevant papers suggested by supervisor

**Week 13 - 20 Oct **

This week i continues to research into parametrised complexity specifically in FPT and algorithmic approaches in parametriused algorithms

* **Research**
* * Conducted further reading from cygan's "parametrised Algorithms" taking notes on the from intro of the book and the fundomentals
  * practical applications of parameterised complexity through examples, specifically **FPT time complexity**.
  * Gained additional understanding of the **Vertex Cover Problem** as it relates to kernelization and parameterized tractability.
  * better understading of kernalisation 



*** Next Steps***

* * Begin structuring the initial sections of the project report based on gathered research.
  * Continue practicing **backtracking problems** on LeetCode, focusing on graph algorithms to improve implementation skills.





**Week 20 - 27 Oct ** 

**Research **

* *  Explored the concept of **P vs NP** more thoroughly, focusing on implications for parameterized algorithms
  *  Examined **kernelization** strategies in greater detail, particularly their use in problems like **Minimum Vertex Cover** .
  * Developed a clearer understanding of the **Boolean Satisfiability Problem (SAT)** 
  * additional backtracking  practice problems
* Continue reading from Cygan’s "Parameterized Algorithms" with a focus on FPT algorithms for the Vertex Cover Problem.  Begin drafting sections of the **final year project (FYP) report**.



***Week 27 oct - 3 noc ***

* implemented some backtracking algorithm for simple problem "Combination sum " just to get a feel of the recursive way of coding i will need later on , i feel much better regarding this aspect now . 
* Next ->  do at least one more problem with a backtracking algorithm then start writing interim fyp as well as arrange a meeting with tutor for next week Friday
* Done with more of backtracking algorithms , feel quite confident with this , Continues to read Vertex cover chapter from Cygan's book , I will now aim to finish  implementation of vertex cover by friday .





**Week 3 Oct - 8 Nov**

- Drafted ~1000 words for the FYP interim report, based on notes but not yet fully polished.
- Practiced two additional backtracking problems to strengthen understanding of techniques.
- Studied formal definitions for kernelization and related concepts.
- Plan to work on more backtracking problems for further practice.
- Aiming to complete the vertex cover algorithm implementation this week.
- Scheduled a meeting with my supervisor to review progress and next steps.

------

### **Week 8–15 Nov**

- Started upon the initial implementation of the vertex cover algorithm.
- Conducted additional research on SAT and CSP solvers, referring to materials from **MT2860** to better understand their relevance .
- Began integrating backtracking methods into the vertex cover implementation, refining the algorithm's logic and structure.
- Used kernelization rules for implementation .

### **Week 15–24 Nov**

- Focused on the technical implementation of the vertex cover algorithm.
- Successfully applied backtracking methods alongside kernelization techniques to create an FPT implementation of the vertex cover.
- Still needs further testing on the implementation, identifying areas requiring further improvement  and potential refactoring (there is quite a fair bit to test ).
- Planned next steps to validate the implementation and optimize for performance.
- Thinking on further improvement perhaps graphical interface could be good.
- next plans , to continue on interim report to talk about SAT and CSP solvers , and comparing FPT to P vs NP , i already have quite bit research on this so its mostly about writing .



**Week 24 - 30**

* Continued refining my interim report, which is now nearing completion.
* Began developing the graphical interface for the Vertex Cover implementation.
* Tomorrow to focus  on improving the referencing in my interim report and finalizing the graphical interface.
* Preparing for next week’s meeting with my supervisor, ensuring the presentation is ready.
* Conducted further research into SAT and CSP solvers, exploring their relevance to the Workflow Satisfiability Problem (WSP).
* Finished with Graphical interface , just had a meeting with supervisor , everything seems good just need to create some tests for my vertex cover 
* My testing so far has only been using debuggin statements etc.. however for proper SE methodology i need to implement some tests 
* Suggestion from supervisor: to hightlight the vertex that are covered 



**Week 8–15 Dec**

* Met with supervisor got feedback on Interface , Should add a color for the vertex cover 

* Finshed interim report need to reform bibliography 

* Additional documentation is needed for my code and Additional tests  

* supervisor reviewed the report and provided recommendations, primarily regarding formatting. Overall, feedback was positive, and the progress appears to be on track.

* Tasks for next week:

* Finished report had quite a busy week used all the time up to submission deadline , finalised report added all insertions reccomended by the supervisor .

* Added yellow highlithing on the GUI for the vertices in the vertex cover 

* Add a demo section to the report to illustrate the working code.

  Complete the documentation, including a detailed README file and improved comments in the codebase.

  * Progress on presentation:

    Continued working on the presentation and scheduled a rehearsal for Wednesday.

    * Was not able to add a deailed README due to time restrictions.
    * Finished Demo .

### **Week 20 Jan - 17 Feb**

* Met with my supervisor to discuss future work, improvements, and feedback from the previous interim submission, as well as potential additions to the project.  
* Discussed the lack of commits this term due to external circumstances, the importance of adopting a more regular commit schedule moving forward, and how this should be mentioned in my diary and acknowledged as a setback in my final report.  
* Wrote an additional 2,000 words in my report, incorporating a more mathematically rigorous discussion of the pattern algorithm developed by Cohen (2015) and the Weighted Set Partitioning (WSP) problem with UI counting constraints.  
* Met with a PhD student who had worked on the same project last year, gaining valuable insights and advice.  

* **Tasks for this week:**  

  * Implement the pattern backtracking algorithm using a fully object-oriented programming (OOP) approach.  
  * Continue expanding my interim report, including:  
    * Discussion on XP algorithms and complexity classes.  
    * Definitions necessary for introducing the algorithms.  
    * Initial draft of the implementation section for the algorithm.  
  * Progress During the Week:
* Gained a deeper understanding of how to **initialize partial plans** and how the **algorithm partitions different subsets**, using the **Bell number bound** to guide the process.  
- Developed **greater clarity** on how to approach the problem effectively.  
- Formulated a **structured plan** to leverage my **graph structure from last term** to efficiently navigate through different **partial plans**. 

### **Week 17 Feb - 28 Feb**

* Implemented PBT without authorization lists so far, only including constraints. Included pruning instead of a brute-force approach.  
* Successfully used my graph structure from last term to formulate the constraints.  
* Expanded my report on XP algorithms and discussed my implementation of the PBT algorithms so far.  

**Tasks for next week :**  
* Include authorization lists and discuss in more detail some of the more advanced but efficient algorithms introduced by Cohen.  
* Explore how to formulate the problem to leverage CSP and SAT solvers for performance comparison.  
* Discuss CSP and SAT formulations in the report.  



### **Week 03 Mar - 09 Mar**

### Weekly Progress

- **Extended** the backtracking implementation and **added tests** for the Constraint Graph class.
- **Conducted additional research** on problem formulation methods for applying SAT solvers.
- **Continued work on the project report**, specifically detailing the implementation approach and progress made.
- **Did not manage to include** authorization lists this week.

---

### Tasks for Next Week

- [ ] Include authorization lists.
- [ ] Finish formulating the Constraint Satisfaction Problem (CSP) and complete all associated tests.
- [ ] Develop an intuitive GUI for specifying constraints.
- [ ] Schedule and hold a meeting with the supervisor to discuss progress and aim to complete the first draft of the report.


### **Week: March 10 - March 20**

## 📌 **Weekly Progress**

- ✅ Implemented tests for **checking the satisfiability** of the WSP and validated different encodings.  
- ✅ Added **authorization lists** along with corresponding tests.  
- ❌ **Did not complete** the first draft of my report.  
- ✅ Conducted further **research on SAT solvers** and decided to use **SAT4J**, as my project is Java-based.  
- ✅ Discussed the **adjacency matrix** in my report.  
- ❌ **GUI implementation is still incomplete.**  

---

## 🎯 **Tasks for the Rest of the Week**

- [ ] Refine the **authorization list implementation**.  
- [ ] Finish formulating the **Constraint Satisfaction Problem (CSP)** and complete all associated tests.  
- [ ] Develop an intuitive **GUI for specifying constraints**.  
- [ ] Schedule and hold a **meeting with my supervisor** to discuss progress and aim to complete the first draft of the report.  

 ### Week: March 20 – April 24

## 📌 Weekly Progress

- ✅ Completed the CSP and SAT formulations  
- ✅ Developed the Swing GUI for the PBT and CSP workflows  
- ✅ Implemented the authorization‐matrix panel for the XP/backtracking algorithm  
- ✅ Added comprehensive JUnit test suites for every major component  
- ✅ Expanded and polished documentation (Javadoc & README)  
- ✅ Met with my supervisor for final review  
- ✅ Finished the full application demo  
- ✅ Drafted and submitted the final report  

---

## 🎯 Remaining Tasks

Demo in 2nd of june 
 