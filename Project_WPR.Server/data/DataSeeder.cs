﻿using Newtonsoft.Json;
using System.IO;

namespace Project_WPR.Server.data {
    public class DataSeeder {
        /// <summary>
        /// Runs the specified c.
        /// </summary>
        /// <param name="c">The c.</param>
        public static void Run(DatabaseContext c) {
            addCars(c);
            addCampers(c);
            addCaravans(c);
            c.SaveChanges();
        }

        /// <summary>
        /// Adds the cars.
        /// </summary>
        /// <param name="_c">The c.</param>
        private static void addCars(DatabaseContext _c) {
            using (StreamReader r = new StreamReader("data/vehiclesJSON/autos.json")) {
                string json = r.ReadToEnd();
                List<CarObj> items = JsonConvert.DeserializeObject<List<CarObj>>(json);

                foreach (CarObj c in items) {
                    Random rand = new Random();
                    Car temp = new Car();
                    temp.Brand = c.merk;
                    temp.Type = c.type;
                    temp.Color = c.kleur;
                    temp.YearOfPurchase = c.aanschafjaar;
                    temp.LicensePlate = c.kenteken;
                    temp.Description = "Car put in database by seeder;";
                    temp.IsAvailable = true;
                    temp.IsDamaged = false;
                    temp.VehicleType = "car";
                    temp.RentalPrice = rand.Next(20, 75);
                    temp.TransmissionType = c.versnellingsbaktype;

                    _c.Cars.Add(temp);
                }
            }
        }

        /// <summary>
        /// Adds the campers.
        /// </summary>
        /// <param name="_c">The c.</param>
        private static void addCampers(DatabaseContext _c) {
            using (StreamReader r = new StreamReader("data/vehiclesJSON/campers.json")) {
                string json = r.ReadToEnd();
                List<CamperObj> items = JsonConvert.DeserializeObject<List<CamperObj>>(json);

                foreach (CamperObj c in items) {
                    Random rand = new Random();
                    Camper temp = new Camper();
                    temp.Brand = c.merk;
                    temp.Type = c.type;
                    temp.Color = c.kleur;
                    temp.YearOfPurchase = c.aanschafjaar;
                    temp.LicensePlate = c.kenteken;
                    temp.Description = "Camper put in database by seeder;";
                    temp.IsAvailable = true;
                    temp.IsDamaged = false;
                    temp.VehicleType = "camper";
                    temp.RentalPrice = rand.Next(50, 150);
                    temp.TransmissionType = c.versnellingsbaktype;
                    temp.RequiredLicenseType = c.benodigdrijbewijs;

                    _c.Campers.Add(temp);
                }
            }
        }

        /// <summary>
        /// Adds the caravans.
        /// </summary>
        /// <param name="_c">The c.</param>
        private static void addCaravans(DatabaseContext _c) {
            using (StreamReader r = new StreamReader("data/vehiclesJSON/caravans.json")) {
                string json = r.ReadToEnd();
                List<caravanobj> items = JsonConvert.DeserializeObject<List<caravanobj>>(json);

                foreach (caravanobj c in items) {
                    Random rand = new Random();
                    Caravan temp = new Caravan();
                    temp.Brand = c.merk;
                    temp.Type = c.type;
                    temp.Color = c.kleur;
                    temp.YearOfPurchase = c.aanschafjaar;
                    temp.LicensePlate = c.kenteken;
                    temp.Description = "Caravan put in database by seeder;";
                    temp.IsAvailable = true;
                    temp.IsDamaged = false;
                    temp.VehicleType = "caravan";
                    temp.RentalPrice = rand.Next(20, 75);

                    _c.Caravans.Add(temp);
                }
            }
        }


        private class caravanobj {
            public string merk { get; set; }
            public string type { get; set; }
            public string kenteken { get; set; }
            public string kleur { get; set; }
            public int aanschafjaar { get; set; }
        }

        private class CarObj {
            public string merk { get; set; }
            public string type { get; set; }
            public string kenteken { get; set; }
            public string kleur { get; set; }
            public int aanschafjaar { get; set; }
            public string versnellingsbaktype { get; set; }
        }

        private class CamperObj {
            public string merk { get; set; }
            public string type { get; set; }
            public string kenteken { get; set; }
            public string kleur { get; set; }
            public int aanschafjaar { get; set; }
            public string versnellingsbaktype { get; set; }
            public string benodigdrijbewijs { get; set; }
        }

    }
}
