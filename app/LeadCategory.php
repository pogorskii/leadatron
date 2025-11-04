<?php

namespace App;

enum LeadCategory: int
{
    case Restaurant = 1;
    case Cafe = 2;
    case Retail = 3;
    case Service = 4;
    case Healthcare = 5;
    case Fitness = 6;
    case Beauty = 7;
    case Entertainment = 8;
    case Professional = 9;
    case Other = 10;
}
