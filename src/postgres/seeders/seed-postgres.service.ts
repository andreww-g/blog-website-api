import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedPostgresService {
  constructor() {}
  /* constructor (
    @InjectRepository(CountryEntity) private readonly countriesRepository:Repository<CountryEntity>,
    @InjectRepository(CityEntity) private readonly citiesRepository: Repository<CityEntity>,
    @InjectRepository(AirportEntity) private readonly airportsRepository: Repository<AirportEntity>,
    @InjectRepository(AirportContactsEntity) private readonly airportContactsRepository: Repository<AirportContactsEntity>,
    @InjectRepository(ServiceEntity) private readonly servicesRepository: Repository<ServiceEntity>,
    @InjectRepository(AdminEntity) private readonly adminsRepository: Repository<AdminEntity>,
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(PopularLocationEntity) private readonly popularLocationEntity: Repository<PopularLocationEntity>,
  ) {}

  async refreshDB () {
    await this.seedAdmins();
    await this.seedAirport();
    await this.seedServices();
    await this.seedArticles();
    await this.seedPopularLocations();
  }

  private async seedAirport () {
    await this.countriesRepository.insert(
      countries.map((countryData) => ({
        name: countryData.name,
        shortCode: countryData.shortCode,
      })),
    );

    const newCountries = await this.countriesRepository.find();

    await this.citiesRepository.insert(
      cities.map((cityData) => {
        const country = newCountries.find((c) => c.shortCode === cityData._meta.countryShortCode);

        if (!country) {
          throw new Error(`Country with shortCode ${cityData._meta.countryShortCode} not found`);
        }

        return {
          name: cityData.name,
          shortCode: cityData.shortCode,
          countryId: country.id,
        };
      }).filter(Boolean),
    );

    const newCities = await this.citiesRepository.find();

    const airportData: Partial<AirportEntity>[] = await Promise.all(airports.map(async (airportData) => {
      const city = newCities.find((c) => c.shortCode === airportData._meta.cityShortCode);

      if (!city) {
        throw new Error(`City with shortCode ${airportData._meta.cityShortCode} not found`);
      }

      const airportServices = services.filter((service) => service.airportIATA === airportData.airportIATA);
      const hasFilledServices = airportServices.some((service) => service.isFilled);

      if (!city.country?.shortCode) {
        throw new Error(`City with shortCode ${airportData._meta.cityShortCode} has no country`);
      }

      const { identifiers: [{ id: contactsId }] } = await this.airportContactsRepository.insert({
        ...pick(airportData, [
          'phone',
          'website',
          'facebook',
          'twitter',
          'instagram',
        ]),
      });

      return {
        ...pick(airportData, [
          'name',
          'airportIATA',
          'posterImageUrl',
          'previewImageUrl',
          'slug',
          'lat',
          'lon',
          'childAgeCutoff',
          'timezone',
        ]),
        contactsId,
        priceFrom: this.calculateAirportPriceFrom(airportServices),
        cityId: city.id,
        hiddenAt: hasFilledServices ? null : new Date(),
        fees: [],
      } as Partial<AirportEntity>;
    }).filter(Boolean));

    await this.airportsRepository.insert(airportData);
  }

  private async seedServices () {
    await this.servicesRepository.insert(services.map((service) => ({
      ...service,
      priceFrom: ServicePriceFromService.calculateServicePriceFrom(service),
    })));
  }

  private async seedAdmins () {
    await this.adminsRepository.insert(admins);
  }

  private async seedArticles () {
    await this.articleRepository.insert(articles);
  }

  private async seedPopularLocations () {
    const airports = await this.airportsRepository.find({ skip: Math.floor(Math.random() * 100), take: 20 });

    await this.popularLocationEntity.insert(
      popularLocations.map((location) => {
        return {
          ...location,
          airportId: airports[Math.floor(Math.random() * airports.length)].id,
        };
      }),
    );
  }

  private calculateAirportPriceFrom (services: Pick<ServiceEntity, 'airportIATA' | 'meeting'>[]): number {
    const prices = services.map((service) => {
      return ServicePriceFromService.calculateServicePriceFrom(service);
    });
    const minPrice = min(prices);

    if (!minPrice) return 0;

    return Number.isFinite(minPrice) ? minPrice : 0;
  }
  */
}
