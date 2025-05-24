interface GroupSizeOption {
  value: string;
  label: string;
  college?: string; // Optional property to accommodate 'college'
}
export const Programs: GroupSizeOption[] = [
  { value: "Regular", label: "Regular" },
  { value: "Weeked", label: "Weeked" },
  { value: "Night", label: "Night" },
  { value: "Summer", label: "Summer" },
];
export const Reasons: GroupSizeOption[] = [
  { value: "Expaired", label: "Expaired" },
  { value: "Lost", label: "Lost" },
];

export const Colleges: GroupSizeOption[] = [
  {
    value: "College of Natural and Computational Sciences",
    label: "College of Natural and Computational Sciences",
  },
  {
    value: "College of Agriculture and Veterinary Medicine",
    label: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "College of Education and Behavioral Studies",
    label: "College of Education and Behavioral Studies",
  },
  {
    value: "College of Medicine and Health Sciences",
    label: "College of Medicine and Health Sciences",
  },
  {
    value: "College of Business and Economics",
    label: "College of Business and Economics",
  },
  {
    value: "College of Social Sciences and Humanities",
    label: "College of Social Sciences and Humanities",
  },
  {
    value: "College of Engineering and Technology",
    label: "College of Engineering and Technology",
  },
];

export const Departments: GroupSizeOption[] = [
  // College of Natural and Computational Sciences
  {
    value: "Biology",
    label: "Biology",
    college: "College of Natural and Computational Sciences",
  },
  {
    value: "Chemistry",
    label: "Chemistry",
    college: "College of Natural and Computational Sciences",
  },
  {
    value: "Physics",
    label: "Physics",
    college: "College of Natural and Computational Sciences",
  },
  {
    value: "Mathematics",
    label: "Mathematics",
    college: "College of Natural and Computational Sciences",
  },
  {
    value: "Statistics",
    label: "Statistics",
    college: "College of Natural and Computational Sciences",
  },

  // College of Agriculture and Veterinary Medicine
  {
    value: "Horticulture and Plant Science",
    label: "Horticulture and Plant Science",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Post-Harvest Management",
    label: "Post-Harvest Management",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Animal Science",
    label: "Animal Science",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Natural Resources Management",
    label: "Natural Resources Management",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Agricultural Economics and Agribusiness Management",
    label: "Agricultural Economics and Agribusiness Management",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Rural Development and Agricultural Extension",
    label: "Rural Development and Agricultural Extension",
    college: "College of Agriculture and Veterinary Medicine",
  },
  {
    value: "Veterinary Medicine",
    label: "Veterinary Medicine",
    college: "College of Agriculture and Veterinary Medicine",
  },

  // College of Education and Behavioral Studies
  {
    value: "Psychology",
    label: "Psychology",
    college: "College of Education and Behavioral Studies",
  },
  {
    value: "Early Childhood Care and Education",
    label: "Early Childhood Care and Education",
    college: "College of Education and Behavioral Studies",
  },
  {
    value: "Educational Planning and Management",
    label: "Educational Planning and Management",
    college: "College of Education and Behavioral Studies",
  },
  {
    value: "Special Needs and Inclusive Education",
    label: "Special Needs and Inclusive Education",
    college: "College of Education and Behavioral Studies",
  },
  {
    value: "Sport Science",
    label: "Sport Science",
    college: "College of Education and Behavioral Studies",
  },

  // College of Medicine and Health Sciences
  {
    value: "Medicine",
    label: "Medicine",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Nursing",
    label: "Nursing",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Midwifery",
    label: "Midwifery",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Public Health",
    label: "Public Health",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Medical Laboratory Science",
    label: "Medical Laboratory Science",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Neonatal Nursing",
    label: "Neonatal Nursing",
    college: "College of Medicine and Health Sciences",
  },
  {
    value: "Family Health",
    label: "Family Health",
    college: "College of Medicine and Health Sciences",
  },

  // College of Business and Economics
  {
    value: "Accounting and Finance",
    label: "Accounting and Finance",
    college: "College of Business and Economics",
  },
  {
    value: "Management",
    label: "Management",
    college: "College of Business and Economics",
  },
  {
    value: "Economics",
    label: "Economics",
    college: "College of Business and Economics",
  },
  {
    value: "Public Administration and Development Management",
    label: "Public Administration and Development Management",
    college: "College of Business and Economics",
  },

  // College of Social Sciences and Humanities
  {
    value: "Sociology",
    label: "Sociology",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Social Work",
    label: "Social Work",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Geography and Environmental Studies",
    label: "Geography and Environmental Studies",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "History and Heritage Management",
    label: "History and Heritage Management",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Political Science and International Relations",
    label: "Political Science and International Relations",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Governance and Development Studies",
    label: "Governance and Development Studies",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "English Language and Literature",
    label: "English Language and Literature",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Ethiopian Language and Literature Studies (Amharic)",
    label: "Ethiopian Language and Literature Studies (Amharic)",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Somali Language and Literature",
    label: "Somali Language and Literature",
    college: "College of Social Sciences and Humanities",
  },
  {
    value: "Arabic Language and Literature",
    label: "Arabic Language and Literature",
    college: "College of Social Sciences and Humanities",
  },

  // College of Engineering and Technology
  {
    value: "Civil Engineering",
    label: "Civil Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Mechanical Engineering",
    label: "Mechanical Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Electrical and Computer Engineering",
    label: "Electrical and Computer Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Software Engineering",
    label: "Software Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Computer Science",
    label: "Computer Science",
    college: "College of Engineering and Technology",
  },
  {
    value: "Information Technology",
    label: "Information Technology",
    college: "College of Engineering and Technology",
  },
  {
    value: "Construction Technology and Management",
    label: "Construction Technology and Management",
    college: "College of Engineering and Technology",
  },
  {
    value: "Surveying Engineering",
    label: "Surveying Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Hydraulic and Water Resource Engineering",
    label: "Hydraulic and Water Resource Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Water Resource and Irrigation Engineering",
    label: "Water Resource and Irrigation Engineering",
    college: "College of Engineering and Technology",
  },
  {
    value: "Pre-Engineering",
    label: "Pre-Engineering",
    college: "College of Engineering and Technology",
  },
];
