from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from .models import Query, QueryResults, ShowTripper, SearchParameters, Trip
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
import requests
import flickrapi
import json

inquiry = ''
key = u'668dea811871ae018f2ba5820af671e9'
secret = u'20f441744a195a41'


@csrf_exempt
def Home(request): #Main View
    if 'reload' in request.POST:
        print 'reload'
        template = render(request, 'build/homeMain.html')
        return HttpResponse(template)

    return render(request, 'build/index.html')


@csrf_exempt
def Map(request):
    if request.GET:
        template = render(request, 'build/mapMain.html')
        return HttpResponse(template)

    return render(request, 'build/mapMain.html')


@csrf_exempt
def api_search_parameters(request):
    if request.POST:
        print request.POST
        data = request.POST

    def set_coordinates(request):
        showtripper = ShowTripper()
        showtripper.coordinates_lat = data['coordsLat']
        showtripper.coordinates_lon = data['coordsLon']
        showtripper.save()
        i = showtripper.id
        i = str(i)
        print showtripper
        print showtripper.coordinates_lat
        print showtripper.coordinates_lon
        print showtripper.coordinates_lat, showtripper.coordinates_lon

        return HttpResponse(i)


    def get_coordinates(data):
        i = data['id']
        print i
        i = int(i)
        print i
        user = ShowTripper.objects.get(pk__exact=i)
    
        coordinates = {}
        coordinates['lattitude'] = user.coordinates_lat
        coordinates['longitude'] = user.coordinates_lon
        print coordinates

        return HttpResponse(json.dumps(coordinates))

    # def set_fav_artist(data):
    #     parameters = SearchParameters()
    #     parameters.fav_artist = data['favArtist']
    #     parameters.fav_genres = data['genres']

    num = request.POST['function']
    print num

    function = {0: set_coordinates,
                1: get_coordinates
    }

    return function[int(num)](data)





@csrf_exempt
def api_jambase_query(request):
    if request.POST:
        print request.POST



@csrf_exempt
def api_flickr_query(request):
    if request.POST:
        print request.POST
        venue_tags = request.POST['venue'] + ", " + request.POST['city'] + ", " + "venue"
        print venue_tags
        artist_tags = request.POST['title'] + ", " + request.POST['title'] + "concert" + ", " + request.POST['title'] + "live music"
        print artist_tags
        venue_photos = cache.get(venue_tags)
        if venue_photos == None:
            print "Calling Flickr (venue)"
            flickr = flickrapi.FlickrAPI(key, secret, format='json')
            venue_photos = flickr.photos.search(tags=venue_tags, tag_mode='all', sort='relevance', per_page='20')
            cache.set(venue_tags, venue_photos, 86400)
        artist_photos = cache.get(artist_tags)
        if artist_photos == None:
            print "Calling Flickr (artist)"
            artist_photos = flickr.photos.search(tags=artist_tags, tag_mode='any', sort='relevance', per_page='20')
            cache.set(artist_tags, artist_photos, 86400)

        print cache.get(artist_tags)
        print cache.get(venue_tags)
        return HttpResponse(json.dumps([artist_photos, venue_photos]))



@csrf_exempt
def api_eventful_query_results(request):
    if request.POST:
        print request.POST
        if 'keywords' in request.POST:
            inquiry = request.POST['keywords'] + request.POST['when']
            q = Query.objects.filter(text__exact=inquiry)
            if len(q) > 0:
                print 'huh?'
                q = q[0]
                query = Query.objects.get(pk=q.id)
                r = query.entries.all()
                return HttpResponse(r)
            else:
                query = Query()
                query.text = inquiry
                query.save()
                return HttpResponse("Make API Call.")
        else:
            inquiry = request.POST['keys'] + request.POST['when']
            query = Query.objects.get(text__exact=inquiry)
            query_results = QueryResults()
            query_results.query = query
            query_results.result = request.POST['result']
            # query_results.time = datetime.now()
            query_results.save()
            return HttpResponse("Saved query results.")




#Test View
def Test(request):
    return render(request, 'build/Test.html')
